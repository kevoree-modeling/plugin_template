package org.kevoree.modeling.addons.template;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.ClassPathResourceManager;
import org.kevoree.modeling.*;
import org.kevoree.modeling.drivers.websocket.gateway.WebSocketGateway;
import org.kevoree.modeling.memory.manager.DataManagerBuilder;
import org.kevoree.modeling.memory.manager.internal.KInternalDataManager;
import org.kevoree.modeling.meta.*;
import org.kevoree.modeling.meta.impl.MetaModel;
import org.kevoree.modeling.scheduler.impl.DirectScheduler;

import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

public class TimeMachineTest {

    //@Test
    public static void main(String[] args) {

        KMetaModel metaModel = new MetaModel("IoTModel");
        KMetaClass sensorClass = metaModel.addMetaClass("Sensor");
        KMetaAttribute sensorValueAtt = sensorClass.addAttribute("value", KPrimitiveTypes.LONG);
        KMetaRelation sensorsRef = sensorClass.addRelation("sensors", sensorClass, null);
        
        KInternalDataManager manager = DataManagerBuilder.create().withScheduler(new DirectScheduler()).build();
        KModel model = metaModel.createModel(manager);
        model.connect(new KCallback() {
            @Override
            public void on(Object o) {
                KObject sensor = model.create(sensorClass, 0, 0);
                sensor.set(sensorValueAtt, "42");

                KListener listener = model.universe(0).createListener();
                listener.listen(sensor);
                listener.then(new KCallback<KObject>() {
                    @Override
                    public void on(KObject kObject) {
                        System.err.println("Update : " + kObject.toJSON());
                    }
                });

                KObject sensor2 = model.create(sensorClass, 0, 0);
                sensor2.set(sensorValueAtt, "43");

                KObject sensor3 = model.create(sensorClass, 0, 0);
                sensor3.set(sensorValueAtt, "44");

                sensor.add(sensorsRef, sensor2);
                sensor.add(sensorsRef, sensor3);

                Random rand = new Random();

                long[] uuids = new long[]{sensor.uuid(), sensor2.uuid(), sensor3.uuid()};
                KCallback<KObject[]> jumped = new KCallback<KObject[]>() {
                    public void on(KObject[] kObjects) {
                        for (int i = 0; i < kObjects.length; i++) {
                            kObjects[i].setByName("value", rand.nextLong());
                        }
                        model.save(null);
                    }
                };
                //create virtually 10 timePoints per objects
                for (int i = 0; i < 10; i++) {
                    model.manager().lookupAllObjects(0, i, uuids, jumped);
                }


            }
        });

        WebSocketGateway gateway = WebSocketGateway.expose(manager.cdn(), 8083);
        gateway.start();
        Undertow.builder().addHttpListener(8084, "0.0.0.0", Handlers.resource(new ClassPathResourceManager(TemplateTest.class.getClassLoader()))).build().start();

        try {
            Thread.sleep(100000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
