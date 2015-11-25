package test;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.ClassPathResourceManager;
import kmf.TemplateTestModel;
import kmf.templateTest.*;
import kmf.templateTest.Color;
import kmf.templateTest.meta.MetaCar;
import kmf.templateTest.meta.MetaPark;
import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.drivers.websocket.gateway.WebSocketGateway;
import org.kevoree.modeling.memory.manager.DataManagerBuilder;
import org.kevoree.modeling.memory.manager.internal.KInternalDataManager;
import org.kevoree.modeling.scheduler.KScheduler;
import org.kevoree.modeling.scheduler.impl.DirectScheduler;

import java.awt.*;

/**
 * Created by ludovicmouline on 25/11/15.
 */
public class Main {
    public static final int BASE_UNIVERSE = 0;
    public static final int BASE_TIME = 0;

    public static void main(String[] args) {
        //Allow the index on Park.name
        MetaPark.ATT_NAME.setKey(true);

        KScheduler scheduler = new DirectScheduler();
        KInternalDataManager dataManager = DataManagerBuilder.create().withScheduler(scheduler).build();

        final TemplateTestModel model = new TemplateTestModel(dataManager);
        init_model(model);
        connection(dataManager);
    }

    private static void connection(KInternalDataManager dataManager) {
        WebSocketGateway gateway = WebSocketGateway.expose(dataManager.cdn(), 8083);
        gateway.start();

        ClassPathResourceManager classPathResourceManager = new ClassPathResourceManager(Main.class.getClassLoader());
        Undertow.builder().addHttpListener(8084, "0.0.0.0", Handlers.resource(classPathResourceManager)).build().start();

        try {
            Thread.sleep(100000);
        } catch (InterruptedException e){
            e.printStackTrace();
        }
    }

    private static void init_model(TemplateTestModel model) {
        model.connect(new KCallback() {
            @Override
            public void on(Object o) {
                Park park = model.createPark(BASE_UNIVERSE,BASE_TIME);
                park.setName("Parking du Glacis");

                Car car1 = model.createCar(BASE_UNIVERSE,BASE_TIME);
                car1.setName("Car1");

                Car car2 = model.createCar(BASE_UNIVERSE,BASE_TIME);
                car2.setName("Car2");

                Car car3 = model.createCar(BASE_UNIVERSE,BASE_TIME);
                car3.setName("Car3");

                park.addCars(car1);
                park.addCars(car2);
                park.addCars(car3);



                WinterTyre car1LeftTyre = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car1LeftTyre.setMark("Mark1");
                WinterTyre car1RightTyre = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car1RightTyre.setMark("Mark1");
                car1.addWinterTyres(car1LeftTyre);
                car1.addWinterTyres(car1RightTyre);

                Color blackColor = model.createColor(BASE_UNIVERSE,BASE_TIME);
                blackColor.setColor("black");
                car1LeftTyre.addColor(blackColor);

                Color blueColor = model.createColor(BASE_UNIVERSE,BASE_TIME);
                blueColor.setColor("blue");
                car1RightTyre.addColor(blueColor);

                WinterTyre car2LeftTyre = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car2LeftTyre.setMark("Mark2");
                WinterTyre car2RightTyre = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car2RightTyre.setMark("Mark2");
                WinterTyre car2LeftTyreBack = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car2LeftTyreBack.setMark("Mark2");
                WinterTyre car2RightTyreBack = model.createWinterTyre(BASE_UNIVERSE,BASE_TIME);
                car2RightTyreBack.setMark("Mark2");
                car2.addWinterTyres(car2LeftTyre);
                car2.addWinterTyres(car2LeftTyreBack);
                car2.addWinterTyres(car2RightTyre);
                car2.addWinterTyres(car2RightTyreBack);

                model.save(null);
            }
        });
    }
}
