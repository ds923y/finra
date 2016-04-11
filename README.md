# finra
# to clone this
`git clone https://github.com/ds923y/finra.git` 
# to run this 
`mvn clean install; mvn appengine:devserver`
you will see the file on localhost:8080
# to compile jsx
`babel pagination.js -o pagination-comp.js;`
# to deploy: 
on https://finra-1262.appspot.com/ run
`mvn appengine:update`
to make before deployment make `<application></application>` consistent with your app name
```xml
<?xml version="1.0" encoding="utf-8"?>
<appengine-web-app xmlns="http://appengine.google.com/ns/1.0">
    <application>finra-1262</application>
    <version>${app.version}</version>
    <threadsafe>false</threadsafe>
    <system-properties>
        <property name="java.util.logging.config.file" value="WEB-INF/logging.properties"/>
    </system-properties>
</appengine-web-app>
```

