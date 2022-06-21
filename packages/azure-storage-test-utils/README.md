# Azure storage test utilities

This module provides Azure storage related functions for use during **unit testing** of the Biodiversity Net Gain Service with either an:

* [Azurite](<https://hub.docker.com/_/microsoft-azure-storage-azurite>) instance.
* an Azure storage account in an isolated Azure development environment such as that provided by a [Visual Studio Enterprise subscription](<https://azure.microsoft.com/en-gb/pricing/member-offers/credit-for-visual-studio-subscribers/>).

The following functions are provided:

* (Re)creation of a storage container.
* Clearing a storage queue.

Due to its destuctive nature this module must **NOT** be used in any connections to infrastructure in official cloud environments.
