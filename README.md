# KMF Template Plugin: JS DOM rendering using models
This plugin offers a JavaScript template to display KMF Model as HTML content

## Last versions:

- 4.27.0 compatible with KMF framework 4.27.x

## Changelog

- 4.27.0 rename JS plugin file in template.js and template.min.js

## API usage

This plugin has been derived from the excellent paperclip.js project.
In addition this has been adapted to perform operations directly on top of models.

Here is the main API documentation of origin paperclip.js:

https://github.com/crcn/paperclip.js/tree/master/docs

In addition examples, in the `src/test/resources` can give elements to use paperclip.js on top of MODELS

## Requirements
To use this plugin, you must have installed the [Kevoree framework](https://github.com/kevoree-modeling/framework) and you should read the [tutorial](https://github.com/kevoree-modeling/tutorial).

## How To

### Installation
Just run the `build.sh` script.

### Running example - list of features
In the `example/CarPark`, there is a complete standalone example. All the features describe in this section can be find in this project.
To run the example : 
* `cd exampleCarPark`
* `mvn clean install`
* `mvn exec:java -Dexec.mainClass=test.Main"`

#### First step : the pom.xml
Add the dependencies to the framework, the webSocket driver (we use it to send the model on websocket) and the plugin template.

```
<!-- The framework to compile the model and create the API of this model -->
<dependency>
    <groupId>org.kevoree.modeling</groupId>
    <artifactId>microframework</artifactId>
    <version>4.27.0</version> <!-- Replace by the last version of KMF -->
</dependency>

<!-- The drivers to send the model on socket -->
<dependency>
    <groupId>org.kevoree.modeling.plugin</groupId>
    <artifactId>websocket</artifactId>
    <version>4.27.0</version> <!-- Replace by the last version of KMF -->
</dependency>

<!-- The plugin template -->
<dependency>
    <groupId>org.kevoree.modeling.plugin</groupId>
    <artifactId>template</artifactId>
    <version>4.27.0</version>
</dependency>
```

Add the plugin to build the API from the metamodel.
```
<plugin>
    <groupId>org.kevoree.modeling</groupId>
    <artifactId>generator.mavenplugin</artifactId>
    <version>4.27.0</version>
    <executions>
        <execution>
            <id>ModelGen</id>
            <phase>generate-sources</phase>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <!-- This is the mame of your metamodel file. It should be at the root of the project-->
                <metaModelFile>kmf.templateTest.mm</metaModelFile>
                <!--Do not forget this line to create the JS API-->
                <js>true</js>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### Second step : create your metamodel and your model
For this example, we create a simple metamodel : 

```
class kmf.templateTest.Park {
    att name : String
    rel cars : kmf.templateTest.Car
}

class kmf.templateTest.Car {
    att name : String
    rel winterTyres : kmf.templateTest.WinterTyre with maxBound 4
}

class kmf.templateTest.WinterTyre {
    att mark : String
    rel color :  kmf.templateTest.Color with maxBound 1
}

class kmf.templateTest.Color {
    att color : String
}
```

For the model, you have two options : either you create a Java program as in this example (`example/CarPark/src/main/java/test/Main.java`) or you create directly your model in the JS script as in the test (`src/test/resources/index.html`). 
I let you see the JAVA code, it is quiet simple. The most important part to see it is the `connection` method. In this method we define the websocket to share the model with a [Undertown](http://undertow.io/).

### Third step : play with the template
At the beginning, you should create a new model which receive somme data from a websocket : 
```
var wsClient = new org.kevoree.modeling.plugin.WebSocketClientPlugin("ws://" + window.location.hostname + ":8083/cdn");
var dataManager = org.kevoree.modeling.memory.manager.DataManagerBuilder.create().withContentDeliveryDriver(wsClient).build();
var model = new kmf.TemplateTestModel(dataManager);
```

After, you just have to : access an element whith the API (lookup, index, ...) and forward it to a template.

#### Access an attribute
In the code below, we access to the 'name' attribute of a `park' element.
```
<template id="templateHeader">
    My Parking - {{park.name}}
</template>
```

#### Access a relation
You have two options : either the repeat tag or the traverse tag. The first one is similar to a foreach loop.
For example, to print the list of cars of the parking, you should do :
```
<template id="templateListCar">
<strong>List of cars : </strong> <br>
<ul>
<repeat each="{{park.cars}}" as="car">
    <li>{{car.name}}</li>
</repeat>
</ul>
</template>
```
The `each` keyword is the array and the `as` is the element.

The second one just access to the relation and return an array of the elements. So, after you can loop on it with the repeat tag or print some attributes as its length. 
```
<traverse src="{{park}}" query="cars" as="car">
    {{car.length}}
</traverse>
```
In the previous code, the `src` is the source element and in the `query` is a query to cross the relations. For more information about queries, look at [selector API](https://github.com/kevoree-modeling/tutorial/tree/master/step1_async#selector-api).

### Modify the model
You an also modify the model from the javascript. In our example, we add a button to add a new car.
```
function addCar() {
        index = index + 1;
        var car = model.createCar(0, 0);
        car.setName("Car" + index);

        model.connect(function () {
            model.lookup(0, 0, 1, function (park) {
                park.addByName("cars", car);
                model.save(function () {
                    model.disconnect(location.reload())
                });
            })
        });
    }
```



