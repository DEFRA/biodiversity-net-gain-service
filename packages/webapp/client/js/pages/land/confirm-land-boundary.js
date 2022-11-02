// Ordnance Survey map initialisation is inspired by https://github.com/OrdnanceSurvey/OS-Data-Hub-API-Demos/tree/3ec3062d286985f7fc899a20be91649ce5d70e03/Airports/Airports-OAuth
import proj4 from 'proj4'
import { get as getProjection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import { Map as OpenLayersMap, View } from 'ol'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import MousePosition from 'ol/control/MousePosition'
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import 'ol/ol.css'

let token

const initialise27700Projection = () => {
  proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
  '+x_0=400000 +y_0=-100000 +ellps=airy ' +
  '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
  '+units=m +no_defs')
  register(proj4)
  getProjection('EPSG:27700').setExtent([0, 0, 700000, 1300000])
}

const setToken = async () => {
  const response = await fetch('/land/os-api-token') // eslint-disable-line
  const data = await response.json()
  if (data.access_token) {
    token = data.access_token
    const timeout = (data.expires_in - 30) * 1000
    setTimeout(setToken, timeout)
  } else {
    throw new Error('Unable to retrieve token')
  }
}

const getFetchOptions = () => {
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const getOptionsFromCapabilities = async config => {
  const url = 'https://api.os.uk/maps/raster/v1/wmts?request=GetCapabilities&service=WMTS'
  const parser = new WMTSCapabilities()
  const response = await fetch(url, getFetchOptions()) // eslint-disable-line
  const text = await response.text()
  const parsedCapabilities = parser.read(text)
  return optionsFromCapabilities(parsedCapabilities, {
    layer: `Road_${config.epsg}`
  })
}

const getBase64TileSource = async blob => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader() //eslint-disable-line
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      reject(err)
    }
  })
}

const tileLoadAsync = async (tile, src) => {
  const response = await fetch(src, getFetchOptions()) //eslint-disable-line
  if (response.ok) {
    const base64TileSource = await getBase64TileSource(await response.blob())
    tile.getImage().src = base64TileSource
  }
}

const tileLoad = (tile, src) => {
  (
    async () => {
      await tileLoadAsync(tile, src)
    }
  )()
}

const getOrdnanceSurveySource = options => {
  return new WMTS({
    attributions: '&copy; <a href="http://www.ordnancesurvey.co.uk/">Ordnance Survey</a>',
    tileLoadFunction: tileLoad,
    ...options
  })
}

const getOrdnanceSurveyLayer = options => {
  return new TileLayer({
    source: getOrdnanceSurveySource(options)
  })
}

const getLandBoundarySource = config => {
  return new VectorSource({
    format: new GeoJSON({
      dataProjection: `EPSG:${config.epsg}`
    }),
    url: '/land/geospatial-land-boundary'
  })
}

const getLandBoundaryStyle = () => {
  return new Style({
    fill: new Fill({
      color: 'rgba(178, 17, 34, 0.1)'
    }),
    stroke: new Stroke({
      color: '#b21122',
      width: 3
    })
  })
}

const getLandBoundaryLayer = config => {
  return new VectorLayer({
    source: getLandBoundarySource(config),
    style: getLandBoundaryStyle()
  })
}

const getView = config => {
  return new View({
    projection: `EPSG:${config.epsg}`,
    center: config.centroid,
    extent: config.extent,
    zoom: config.epsg === '27700' ? 13 : 17,
    showFullExtent: true
  })
}

const getScaleBarControl = () => {
  return new ScaleLine({
    bar: true,
    steps: 4,
    text: true,
    minWidth: 140
  })
}

const getMousePositionControl = config => {
  return new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: `EPSG:${config.epsg}`,
    className: '.map-coordinates',
    target: document.getElementById('map-coordinates')
  })
}

const getMapOptions = async config => {
  const capabilityOptions = await getOptionsFromCapabilities(config)
  const ordnanceSurveyLayer = getOrdnanceSurveyLayer(capabilityOptions)
  const landBoundaryLayer = getLandBoundaryLayer(config)
  return {
    layers: [ordnanceSurveyLayer, landBoundaryLayer],
    view: getView(config)
  }
}

const getMap = async config => {
  const options = await getMapOptions(config)
  const scaleBarControl = getScaleBarControl()
  const mousePositionControl = getMousePositionControl(config)
  return new OpenLayersMap({
    controls: defaultControls().extend([scaleBarControl, mousePositionControl]),
    target: 'map',
    layers: options.layers,
    view: options.view,
    interactions: options.interactions || []
  })
}

const initialiseMap = config => {
  (
    async () => {
      await setToken()
      if (config.epsg === '27700') {
        initialise27700Projection()
      }
      await getMap(config)
    }
  )()
}

export { initialiseMap }
