## 1.1.0
- Stable release latest

## 1.0.0
- First stable release

## 1.0.0-rc.2
- Make sure that Injector delivers correct Token at correct Injection point!

## 1.0.0-rc.1
- DI Decorators - Avoid Typescript abstract class inheritance injection issue

## 1.0.0-rc.0
- Release candidate

## 1.0.0-beta.23
- Update dev packages and && fix controller resolver type issue

## 1.0.0-beta.22
- Restructure logging types

## 1.0.0-beta.21
- Added multipart parser

## 1.0.0-beta.20
- Update route parser add more flexibility

## 1.0.0-beta.19
- Added more flexibility to router, route parsing and pattern matching

## 1.0.0-beta.18
- Fix Route parser and route resolver

## 1.0.0-beta.16
- Fix Logger && Router provider resolving and verification

## 1.0.0-beta.15
- Added better error resolution for modules which are not registered in system

## 1.0.0-beta.14
- Fix module duplication resolution 

## 1.0.0-beta.13
- Update to typescript 2.3.x

## 1.0.0-beta.12
- Fix Logger, Router references
- Added module name duplication check

## 1.0.0-beta.11
- Fix nested module imports

## 1.0.0-beta.10
- Copy query params to params if thy are not defined from path param
- Don't throw exception if @Param is not defined in route!
- Injector -> Expose exports to importers

## 1.0.0-beta.9
- Fix module imports -> Imported modules should export it's exports to module which imports them not only to it's imports
- IModuleMetadata no longer requires controller as default type

## 1.0.0-beta.8
- Fix router rule resolution issue only false or IResolvedRoute is allowed

## 1.0.0-beta.7
- Export Headers interface from route

## 1.0.0-beta.6
- Fix router addRule 

## 1.0.0-beta.5
- Update router addRule second parameter as optional

## 1.0.0-beta.4
- Improve merging IProvider algorithm

## 1.0.0-beta.3
- Fix merge algorithm on nested modules which have wrong execution order for providers

## 1.0.0-beta.2
- Remove OnError decorator since is not used anymore

## 1.0.0-beta.1
- Remove forwarder / forwarded
- Since beta no major API changes will happen.

## 1.0.0-alpha-37
- Added benchmark to logger

## 1.0.0-alpha-36
- Added fakeControllerActionCall for better testing purposes

## 1.0.0-alpha-35
- Rename Error to ErrorMessage decorator

## 1.0.0-alpha-34
- Implemented global error route handler , every module can have own error handler route


## 1.0.0-alpha-33
- StatusCode renamed to Status
- fix status code bug while redirect

## 1.0.0-alpha-32
- Exchanged status code api
- Added redirect to request

## 1.0.0-alpha-31
- Added fake http api for testing 
- Remove demo app from framework repo


## 1.0.0-alpha-30
- Changed @Chain @BeforeEach @AfterEach to not be function calls
- Updated tests for controller 
- Exchanged controllerResolver api

## 1.0.0-alpha-28
- Fixed injections for constructor and action params 
- Added tests for Injector

## 1.0.0-alpha-25
- Remove unnecessary dependencies in package.json  

## 1.0.0-alpha-24
- Fix injector processor
- Fix status code and content type resolver

## 1.0.0-alpha-23
- Refactored request processing
- Implemented module system

## 1.0.0-alpha-22
- Added module implementation sketches, missing implementation for modules

## 1.0.0-alpha-21

- Implemented filters
- Fixed request chain processing
