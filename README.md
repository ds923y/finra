# finra
# to run this 
mvn clean install; mvn appengine:devserver
# to compile jsx
babel pagination.js -o pagination-comp.js;
# to deploy to appspot
https://finra-1262.appspot.com/ 
# make before deployment make <application></application> consistent with your app name
<?xml version="1.0" encoding="utf-8"?>
<appengine-web-app xmlns="http://appengine.google.com/ns/1.0">
    <application>finra-1262</application>
    <version>${app.version}</version>
    <threadsafe>false</threadsafe>

    <system-properties>
        <property name="java.util.logging.config.file" value="WEB-INF/logging.properties"/>
    </system-properties>
</appengine-web-app>
