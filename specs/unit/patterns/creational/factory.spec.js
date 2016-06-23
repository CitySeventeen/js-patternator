import factory from "../../../../src/patterns/creational/factory.js";
import singleton from "../../../../src/patterns/creational/singleton.js";

describe('Factory', function() {
  var Car;
  var CarFactory;
  var Honda, Civic, civic;
  var Toyota, Corolla, corolla;
  
  beforeEach(function() {
    Civic = class {
      constructor(year) {
        this.year = year;
      }
    };
    Corolla = class {
      constructor(year) {
        this.year = year;
      }
    };
    CarFactory = factory({
      constructor: function (name) {
        this._name = name;
      }
    }).__class();

    Honda = new CarFactory("Honda San Diego");
    Toyota = new CarFactory("Toyota San Diego");

    Honda.add("civic", Civic);
    Toyota.add("corolla", Corolla);

    civic = Honda.create("civic", 2016);
    corolla = Toyota.create("corolla", 2016);
  });
  it("should create a Factory", function() {
    expect(CarFactory).toBeDefined();
    expect(Honda).toBeDefined();
    expect(Toyota).toBeDefined();
    expect(Honda._name).toEqual("Honda San Diego");
    expect(Toyota._name).toEqual("Toyota San Diego");
  });




  // var vehicleFactory;
  // var Toyota;
  // var Honda;
  // var commonFunctionality;
  // var toyotaCar, toyotaOptions;
  // var hondaCar, hondaOptions;
  // beforeEach(function() {
  //   commonFunctionality = {
  //     turnOn: jasmine.createSpy("turnOnSpy")
  //   };

  //   toyotaOptions = { name: "camry" };
  //   hondaOptions = { name: "accord" };

  //   Toyota = class {
  //     constructor(options) {
  //       this.name = options.name;
  //       this.brand = "toyota";
  //     }
  //   };

  //   Honda = class {
  //     constructor(options) {
  //       this.name = options.name;
  //       this.brand = "honda";
  //     }
  //   };

  //   vehicleFactory = factory(commonFunctionality)
  //   .add("honda", Honda)
  //   .add("toyota", Toyota);

  //   hondaCar = vehicleFactory.create("honda", hondaOptions);
  //   toyotaCar = vehicleFactory.create("toyota", hondaOptions);
  // });
  // it('should be able to share common functionality', function() {
  //   hondaCar.turnOn();
  //   toyotaCar.turnOn();
  //   expect(commonFunctionality.turnOn.calls.count()).toEqual(2);
  // });
  // it('should be able to receive multiple arguments', function() {
  //   var arg1 = 1, arg2 = "2", arg3 = {}, arg4 = _ => {};

  //   var spy = jasmine.createSpy("spy");
  //   var f = factory()
  //   .add("test", spy);

  //   f.create("test", arg1, arg2, arg3, arg4);
  //   expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3, arg4);
  // });
  // it('should implement chainable method pattern', function() {
  //   expect(
  //     vehicleFactory.add("test", _ => {})
  //   ).toEqual(vehicleFactory);
  // });
  // it('should contain 2 classes', function() {

  //   expect(vehicleFactory.count()).toEqual(2);
  //   expect(vehicleFactory.contains(Honda)).toBeTruthy();
  //   expect(vehicleFactory.contains(Toyota)).toBeTruthy();
  // });
  // it('shouldn\'t allow duplicates', function() {
  //   expect(
  //     _ => vehicleFactory.add("honda", _ => {})
  //   ).toThrowError("class is already defined in factory");
  // });
  // it('should throw if class doesn\' exist', function() {
  //   expect(
  //     _ => vehicleFactory.create("EMPTY")
  //   ).toThrowError("class is not defined in factory");
  // });
  // it('should create new instances', function() {
  //   expect(hondaCar instanceof Honda).toBeTruthy();
  //   expect(toyotaCar instanceof Toyota).toBeTruthy();
  // });

  // describe('Singleton Factory Example', function() {
  //   var singletonFactory;
  //   var SingletonHonda;
  //   var SingletonToyota;
  //   beforeEach(function() {
  //     // not that you will ever do this for car factories
  //     // but for the purpose of this explanation.
  //     SingletonHonda = singleton(Honda);
  //     SingletonToyota = singleton(Toyota);

  //     singletonFactory = factory()
  //     .add("honda", SingletonHonda)
  //     .add("toyota", SingletonToyota);

  //     hondaCar = singletonFactory.create("honda", hondaOptions);
  //     toyotaCar = singletonFactory.create("toyota", toyotaOptions);
  //   });

  //   it('should create an instance', function() {
  //     expect(hondaCar instanceof SingletonHonda).toBeTruthy();
  //     expect(hondaCar instanceof Honda).toBeTruthy();
  //     expect(toyotaCar instanceof SingletonToyota).toBeTruthy();
  //     expect(toyotaCar instanceof Toyota).toBeTruthy();
  //   });
  //   it('should always be the same instance', function() {
  //     // even if the options are removed, it should always return the same car.
  //     // this is because I'm adding singletons to the factory.
  //     expect(singletonFactory.create("honda")).toEqual(hondaCar);
  //     expect(singletonFactory.create("toyota")).toEqual(toyotaCar);
  //   });
  //   it('should contain Singleton implementation and not the normal Factories', function() {
  //     expect(singletonFactory.contains(SingletonToyota)).toBeTruthy();
  //     expect(singletonFactory.contains(SingletonHonda)).toBeTruthy();
  //     expect(singletonFactory.contains(Honda)).not.toBeTruthy();
  //     expect(singletonFactory.contains(Toyota)).not.toBeTruthy();
  //   });
  // });

  // describe('Advanced Level: Factory of Factories', function() {
  //   var HondaFactory;
  //   var ToyotaFactory;
  //   var FactoryOfFactories;
  //   var civic;
  //   var accord;
  //   var corolla;
  //   var camry;
  //   beforeEach(function() {
  //     var singletonFactory = fac => {
  //       return singleton(class {
  //         constructor() {
  //           this.__fac = fac;
  //         }
  //       });
  //     };

  //     /**
  //      * I also used a singleton as I only want to return
  //      * a factory once and not multiple new factories.
  //      *
  //      * With this, you can see that the sky is the limit.
  //      * You might not need to have this type of factories,
  //      * but you can scale this idea to something like a
  //      * factory of services, etc.
  //      */
  //     FactoryOfFactories = factory()
  //     .add("HondaFactory", singletonFactory(
  //       factory()
  //       .add("civic", class {
  //         constructor() {
  //           this.name = "civic";
  //           this.brand = "honda";
  //         }
  //       })
  //       .add("accord", class {
  //         constructor() {
  //           this.name = "accord";
  //           this.brand = "honda";
  //         }
  //       })
  //     ))
  //     .add("ToyotaFactory", singletonFactory(
  //       factory()
  //       .add("corolla", class {
  //         constructor() {
  //           this.name = "corolla";
  //           this.brand = "toyota";
  //         }
  //       })
  //       .add("camry", class {
  //         constructor() {
  //           this.name = "camry";
  //           this.brand = "toyota";
  //         }
  //       })
  //     ));

  //     HondaFactory = FactoryOfFactories.create("HondaFactory").__fac;
  //     ToyotaFactory = FactoryOfFactories.create("ToyotaFactory").__fac;

  //     civic = HondaFactory.create("civic");
  //     accord = HondaFactory.create("accord");
  //     corolla = ToyotaFactory.create("corolla");
  //     camry = ToyotaFactory.create("camry");
  //   });
  //   it('should crete the factories', function() {
  //     expect(HondaFactory).toBeDefined();
  //     expect(ToyotaFactory).toBeDefined();
  //   });
  //   it('should have created the cars', function() {
  //     expect(civic.name).toEqual("civic");
  //     expect(civic.brand).toEqual("honda");
  //     expect(accord.name).toEqual("accord");
  //     expect(accord.brand).toEqual("honda");
  //     expect(corolla.name).toEqual("corolla");
  //     expect(corolla.brand).toEqual("toyota");
  //     expect(camry.name).toEqual("camry");
  //     expect(camry.brand).toEqual("toyota");
  //   });
  // });
});