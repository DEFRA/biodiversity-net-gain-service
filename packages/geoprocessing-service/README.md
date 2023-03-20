# Geoprocessing service

 A library providing cloud vendor agnostic geoprocessing functionality.

## Testing

The geoprocessing service uses [gdal-async](https://www.npmjs.com/package/gdal-async) internally and requires significant mocking for unit testing purposes accordingly.
As such, narrow integration tests are used with gdal-async connecting to a containerised [Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) instance.

The gdal-async module uses a native dependency to access the [GDAL](https://gdal.org/) library. Connectivity between GDAL and the containerised Azuite instance is achieved
by setting the environment variable **AZURE_STORAGE_CONNECTION_STRING** as defined in the [GDAL virtual file system](https://gdal.org/user/virtual_file_systems.html)
documentation. As environment variables set programmatically for testing purposes do not appear to propagate to native code, this environment variable is set in the shell
script [run-unit-tests](../../bin/run-unit-tests). The environment variable in this shell script assumes use of the default Azurite storage account using a container
running on localhost. To override this configuration, the environment variable **AZURITE_STORAGE_CONNECTION_STRING** can be used.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

[http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

The following attribution statement MUST be cited in your products and applications when using this information.
> Contains public sector information licensed under the Open Government license v3

### Additional licencing information

Refer to [NOTICE](./NOTICE)
