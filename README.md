## org.slashlib building template for angular libraries ##

This is a project template for building angular libraries like:
* @org.slashlib/ng-services-core
* @org.slashlib/ng-services-i18n

If you like to know how to setup your own project template from scratch, take a look at these excellent blog posts of Todd Palmer:  
https://blog.angularindepth.com/the-angular-library-series-publishing-ce24bb673275

## getting started ##

This guide assumes, that you are familiar with the use of npm.  

Download <code>org.slashlib-ng-project-template-&lt;version&gt;.tgz</code> or

<code>npm install @org.slashlib/ng-project-template --save-dev</code>

## building the library ##

* Browse https://github.com/org-slashlib/ng-project-template and download (no fork required!) a zip/tar of the the project template.
* Run <code> npm install </code> in the project template folder.
* Link in angular projects/libraries to build. <br />
  Use hardlinks/junctions on windows to keep the libraries separated from the building template.
* add a subdirectory <code>config/angular</code> to your library and copy/modify
  * <code>angular.lib.json</code>
  * <code>ng-package.json</code>
  * <code>tsconfig.lib.json</code>
  * <code>tsconfig.spec.json</code> (optional)
  * <code>tslint.json</code>
* Modify gruntfile.js (angularjson patterns must match your libraries)
* Don't forget to <code>npm install</code> packages required by your own libraries.
* Run: <code> grunt </code>
* Change to build directory: <code> cd build </code>
* Call <code> ng build &lt;your-library&gt;</code>
* Change to dist/&lt;your-library&gt; directory: <code> npm pack </code>
* <code> npm install path/to/&lt;your-library&gt;-&lt;version&gt;.tgz</code>
