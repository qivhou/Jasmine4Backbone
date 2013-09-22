describe("Backbone.Module.js", function(){
    var proxy = Backbone.Model.extend();
    var klass = Backbone.Collection.extend({
        url : function(){
            return "/collection";
        }
    });
    var doc, collection;

    describe("initialize method", function(){
        var ModelA;
        beforeEach(function(){
            ModelA = Backbone.Model.extend({
                initialize: function(){
                    this.one = 1;
                }
            });
        });

        it("can be used to set initial values and methods", function(){
            var Model = Backbone.Model.extend({
                initialize: function(){
                    this.one = 1;
                    this.getOne = function(){
                        return this.one;
                    };
                }
            });
            var model = new Model();
            expect(model.one).toEqual(1);
            expect(model.getOne()).toEqual(1);
        });

        it("can be used with attirbutes and options", function(){
            var Model = Backbone.Model.extend({
                initialize: function(attributes, options){
                    this.one = options.one;
                }
            });
            var model = new Model({A : "a"}, {one: 1});
            expect(model.one).toEqual(1);
            expect(model.get("A")).toEqual("a");
        });

        it("will set parsed attributes, once {parse : true } as an option", function(){
            var Model = Backbone.Model.extend({
                parse: function(attrs){
                    attrs.value += 1;
                    return attrs;
                }
            });
            var model = new Model({value : 1, name:"new model"}, {parse:true});
            expect(model.get("value")).toEqual(2);
            expect(model.get("name")).toEqual("new model");
        });
    });

    describe("constructor method", function(){
        it("can be overrided to custom", function(){
            var Model = Backbone.Model.extend({
                constructor : function(attributes, options){
                    //extend the modelOptions in source code
                    var modelOptions = ['userID', 'orgID'];
                    _.extend(this, _.pick(options, modelOptions));
                    Backbone.Model.apply(this, arguments);
                }
            });

            var model = new Model({value : 1}, {
                groupID: "003",
                userID : "00001",
                orgID: "10001"
            });
            expect(model.get("value")).toEqual(1);
            expect(model.userID).toEqual("00001");
            expect(model.orgID).toEqual("10001");
            expect(model.groupID).not.toBeDefined();
        });
    });

    describe("defaults hash or function", function(){
        it("can be used to specify the default attributes when initialize", function(){
            var Model = Backbone.Model.extend({
                defaults : {
                    "name" : "BackboneJS",
                    "version" : "1.0.0"
                }
            });

            var model = new Model();
            expect(model.get("name")).toEqual("BackboneJS");
            expect(model.get("version")).toEqual("1.0.0");
        });

        it("can be defined as a function", function(){
            var Model = Backbone.Model.extend({
                defaults : function(){
                    return {
                        "name" : "BackboneJS",
                        "version" : "1.0.0"
                    };
                }
            });

            var model = new Model();
            expect(model.get("name")).toEqual("BackboneJS");
            expect(model.get("version")).toEqual("1.0.0");
        });

        it("can be overrided, once setting same attribute in attributes", function(){
            var Model = Backbone.Model.extend({
                defaults : {
                    "name" : "BackboneJS",
                    "version" : "1.0.0"
                }
            });

            var model = new Model({name : "underscoreJS"});
            expect(model.get("name")).toEqual("underscoreJS");
            expect(model.get("version")).toEqual("1.0.0");
        });
    });

    describe("get method", function(){
        it("used to get current value of an attribute", function(){
            var Model = Backbone.Model.extend({
                defaults : {
                    "name" : "Vincent",
                    "age" : 30
                }
            });

            var model = new Model();
            expect(model.get("name")).toEqual("Vincent");
            expect(model.get("age")).toEqual(30);
            expect(model.get("job")).toBeUndefined();
        });
    });

    describe("escape method", function(){
        it("can be used to get the HTML-escaped value of an attribute", function(){
            var hacker = new Backbone.Model({
                xss : "<script>alert('xss')</script>",
                normal : "Tom & Jerry"
            });

            expect(hacker.escape("xss")).toMatch(/^&lt;(.*)&gt;$/);
            expect(hacker.escape("normal")).toEqual("Tom &amp; Jerry");
        });
    });

    describe("has method", function(){
        var model;
        beforeEach(function(){
            model = new Backbone.Model({
                "zero" : 0,
                "one" : 1,
                "true" : true,
                "false" : false,
                "empty" : '',
                "emptyArray" : [],
                "null" : null,
                "undefined" : undefined
            });
        })

        it("can be used to check if the attribute has a non-null or non-undefined value", function(){
            expect(model.has("zero")).toBeTruthy();
            expect(model.has("one")).toBeTruthy();
            expect(model.has("true")).toBeTruthy();
            expect(model.has("false")).toBeTruthy();
            expect(model.has("empty")).toBeTruthy();
            expect(model.has("emptyArray")).toBeTruthy();
            expect(model.has("null")).toBeFalsy();
            expect(model.has("undefined")).toBeFalsy();
        });

        it("can be used to check if an attribute existed on the model", function(){
            model.set({ name : "has"});
            expect(model.has("name")).toBeTruthy();
            model.unset("name");
            expect(model.has("name")).toBeFalsy();
        });
    });

    describe("set method", function(){
        var Model, model;
        beforeEach(function(){
            Model = Backbone.Model.extend({
                defaults : {
                    "name" : "Vincent",
                    "age" : 30
                }
            });
            model = new Model();
        });

        it("can be used to set value for an attribute", function(){
            expect(model.get("name")).toEqual("Vincent");
            expect(model.get("age")).toEqual(30);

            model.set("job", "web developer");
            expect(model.get("job")).toEqual("web developer");
        });

        it("can be used to set value for multiple attributes", function(){
            model.set({"age" : 29, "hobby" : "Game" });

            expect(model.get("age")).toEqual(29);
            expect(model.get("hobby")).toEqual("Game");
        });
    });

    describe("unset method", function(){
        it("remove an attribute by deleteing from internal attributes hash", function(){
            var model = new Backbone.Model({
                name : "unset",
                action : "Delete"
            });

            model.unset("name");
            expect(model.get("name")).toBeUndefined();
            expect(model.has("name")).toBeFalsy();
            model.unset("action")
            expect(model.get("action")).toBeUndefined();
            expect(model.has("action")).toBeFalsy();
        });
    });

    describe("clear method", function(){
        it("removes all attributes from the model, including the id attribute", function(){
            var model = new Backbone.Model({
                id : 1,
                name : "Clear"
            });
            expect(model.id).toEqual(1);
            expect(model.get("name")).toEqual("Clear");

            model.clear();
            expect(model.has("id")).toBeFalsy();
            expect(model.id).toBeUndefined();
            expect(model.has("name")).toBeFalsy();
            expect(model.get("name")).toBeUndefined();
        });
    });

    describe("id", function(){
        it("can be set as arbitrary string (integer id or UUID)", function(){
            var model = new Backbone.Model({
                id : 100,
                name : "Model"
            });

            expect(model.id).toEqual(100);
            model.id = 10001;
            expect(model.id).toEqual(10001);
            model.id = "Model-ID-1001";
            expect(model.id).toEqual("Model-ID-1001");
        })
    });

    describe("idAttribute", function(){
        it("can be used to map the real id to an different key", function(){
            var Model = Backbone.Model.extend({
                idAttribute : "_id"
            });

            var model ;
            model = new Model({ _id : 1});
            expect(model.id).toEqual(1);

            model = new Model();
            expect(model.id).toBeUndefined();
            model.set("_id", 1001);
            expect(model.id).toEqual(1001);
        })
    });

    describe("cid", function(){
        it("can be generated when the model created", function(){
            var model = new Backbone.Model({});
            expect(model.cid).not.toBeUndefined();
        });

        it("is a unique id automatically", function(){
            var model1 = new Backbone.Model();
            var model2 = new Backbone.Model();
            expect(model1.cid).not.toEqual(model2.cid);
        });
    });

    describe("attributes", function(){
        var obj, model = new Backbone.Model({
            id : 1,
            name : "model",
            title : "temp model"
        });

        it("contains all the model initial data", function(){
            obj = _.clone(model.attributes);
            expect(obj.id).toEqual(1);
            expect(obj.name).toEqual("model");
            expect(obj.title).toEqual("temp model");
        });

        it("contains all the value be set", function(){
            model.set("country", "US");
            model.set("language", "EN");
            obj = _.clone(model.attributes);
            expect(obj.country).toEqual("US");
            expect(obj.language).toEqual("EN");
        });
    });

    describe("changed", function(){
       var model;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                age : 18
            });
        });

        it("is {} if no 'change' happened", function(){
            expect(model.changed).toEqual({});
        });

        it("contains all the attributes that have changed since the last 'change' event", function(){
            model.set("name", "Jasmine");
            model.set("version", "2.0.0-rc2");
            expect(model.changed.name).not.toEqual("Jasmine");
            expect(model.changed.version).toEqual("2.0.0-rc2");
        });

        it("will not contains the attributes changed not by 'set'", function(){
            model.attributes["name"] = "Jasmine.js";
            expect(model.get("name")).toEqual("Jasmine.js");
            expect(model.changed).toEqual({});
        });
    });

    describe("hasChanged", function(){
        var model;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                nameChanged : false,
                age : 18,
                ageChanged : false
            });

            model.on("change", function(){
                if (model.hasChanged("name")){
                    model.set("nameChanged", true);
                }
                if(model.hasChanged("age")) {
                    model.set("ageChanged", true);
                }
            });
        });

        it("returns false if no changes happen", function(){
            expect(model.hasChanged()).toBeFalsy();
        });

        it("returns true if changes happen", function(){
            model.set("name", "new name");
            expect(model.hasChanged()).toBeTruthy();
        });

        it("used to detect if an attribute was changed since the last change", function(){
            model.set("name", "new name");
            expect(model.get("nameChanged")).toBeTruthy();
            expect(model.get("ageChanged")).toBeFalsy();
            model.set("age", 20);
            expect(model.get("ageChanged")).toBeTruthy();
        });

        it("used to detect if multiple attributes were changed since the last change", function(){
            model.set({name : "new name", age : 20});
            expect(model.get("nameChanged")).toBeTruthy();
            expect(model.get("ageChanged")).toBeTruthy();
        });

        it("works outside of change events if an attribute was changed", function(){
            model.set("name", "new name");
            expect(model.hasChanged("name")).toBeTruthy();
            expect(model.hasChanged("age")).toBeFalsy();

            model.set("age", 20);
            expect(model.hasChanged("age")).toBeTruthy();
            model.set("age", 20);
            expect(model.hasChanged("age")).toBeFalsy();
        });

        it("works outside since the last change event for an attribute", function(){
            model.set("name", "new name");
            model.set("age", 20);
            expect(model.hasChanged("name")).toBeFalsy();
            expect(model.hasChanged("age")).toBeTruthy();
            model.set("age", 20);
            expect(model.hasChanged("age")).toBeFalsy();
        });

        it("works outside since the last change event for multiple atrributes", function(){
            model.set({name : "new name", age : 20});
            expect(model.hasChanged("name")).toBeTruthy();
            expect(model.hasChanged("age")).toBeTruthy();
            model.set({name : "new name", age : 20});
            expect(model.hasChanged("name")).toBeFalsy();
            expect(model.hasChanged("age")).toBeFalsy();
        });
    });

    describe("changedAttributes", function(){
        var model, changedObj;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                age : 18
            });
        });

        it("is false if there're none attributes changed", function(){
            changedObj = model.changedAttributes();
            expect(changedObj).toBeFalsy();
        });

        it("contains changed property if there's attribute changed", function(){
            model.set("age", 20);
            changedObj = model.changedAttributes();
            expect(changedObj["age"]).toEqual(20);
        });

        it("contains changed propertes if there're attributes changed", function(){
            model.set({age: 20, name : "new name"});
            changedObj = model.changedAttributes();
            expect(changedObj["age"]).toEqual(20);
            expect(changedObj["name"]).toEqual("new name");
        });

        it("returns changed attributes obj by comparing with the obj passed", function(){
            model.set("age", 20);
            changedObj = model.changedAttributes({age : 20});
            expect(changedObj).toBeFalsy();

            changedObj = model.changedAttributes({age : 21});
            expect(changedObj["age"]).toEqual(21);
        });

        it("returns changed attributes obj by comparing with the obj passed", function(){
            model.set({age: 20, name : "new name"});
            changedObj = model.changedAttributes({age : 20});
            expect(changedObj).toBeFalsy();

            changedObj = model.changedAttributes({age : 21, name : "new name"});
            expect(changedObj["age"]).toEqual(21);
            expect(changedObj["name"]).toBeUndefined();
        });

        it("contains unset properties", function(){
            model.unset("age");
            changedObj = model.changedAttributes({age : 20});
            expect(changedObj["age"]).toEqual(20);
        });
    });

    describe("previous", function(){
        var model, changedObj;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                age : 18
            });
        });

        it("can be used to get previous value of a changed value", function(){
            model.set("name", "new name");
            expect(model.previous("name")).toEqual("model");
        });

        it("can be used to get previous value of an attribute just for the last 'change' event", function(){
            model.set("name", "new name");
            model.set("age", 20);
            // it's not equal to the previous value but the latest one.
            expect(model.previous("name")).not.toEqual("model");
            expect(model.previous("age")).toEqual(18);
        });
    });

    describe("previousAttributes", function(){
        var model;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                age : 18
            });
        });

        it("can be used to get all of previous attributes before last changed event", function(){
            model.set("name", "new name");
            expect(model.previousAttributes()).toEqual({name:"model", age: 18});
        });

        it("can be used to get all of previous attributes just for the last  'change' event", function(){
            model.set("name", "new name");
            model.set("age", 20);
            expect(model.previousAttributes()).toEqual({name: "new name", age: 18});
        });
    });

    describe("isNew", function(){
        var model;
        beforeEach(function(){
            model = new Backbone.Model({
                name : "model",
                age : 18
            });
        });

        it("should be true for a new model", function(){
            expect(model.isNew()).toEqual(true);
        });

        it("should be true for a model with ID valude null or undefined", function(){
            model.set("id", undefined);
            expect(model.isNew()).toEqual(true);

            model.set("id", null);
            expect(model.isNew()).toEqual(true);
        });

        it("should be false for a model with ID valued non-null and non-undefined", function(){
            model.set("id", 1);
            expect(model.isNew()).toEqual(false);

            model.set("id", -100);
            expect(model.isNew()).toEqual(false);

            model.set("id", "test_id");
            expect(model.isNew()).toEqual(false);

            model.set("id", false);
            expect(model.isNew()).toEqual(false);

            model.set("id", 0);
            expect(model.isNew()).toEqual(false);
        });
    });

    describe("clone", function(){
        var a = new Backbone.Model({
            'foo' : 1,
            'bar' : 2,
            'baz' : 3
        });
        var b = a.clone();

        it("can be used to get a same instance", function(){
            expect(a.get('foo')).toEqual(b.get('foo'));
            expect(a.get('bar')).toEqual(b.get('bar'));
            expect(a.get('baz')).toEqual(b.get('baz'));
        });
    });

});
