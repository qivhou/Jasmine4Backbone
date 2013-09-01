describe("Backbone.Events.js", function(){
    describe("on method", function(){
        var a;
        beforeEach(function(){
            a = _.extend({
                counter:0
            }, Backbone.Events);
        });
        it("can bind a callback",function(){
            a.on("event", function(){
                a.counter++;
            });

            a.trigger("event");
            expect(a.counter).toEqual(1);
        });
        it("can bind a callback with context", function(){
            var increment = function(){
                this.counter++;
            };
            a.on("event", increment, a);

            a.trigger("event");
            a.trigger("event");
            expect(a.counter).toEqual(2);
        })
        it("can bind a callback to all", function(){
            a.on("all", function(){
                a.counter++;
            });

            a.trigger("anything");
            expect(a.counter).toEqual(1);

            a.trigger("other");
            expect(a.counter).toEqual(2);
        });
        it("can bind a callback to mutiple events", function(){
            a.on("hello bye thanks", function(){
                a.counter++;
            });

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);
        });
        it("can bind callback with event maps", function(){
            a.on({
                "hello" : function(){
                    a.counter++;
                },
                "bye" : function(){
                    a.counter++;
                },
                "thanks" : function(){
                    a.counter++;
                }
            });

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);
        });
        it("can bind callback with event maps and context", function(){
            var increment = function(){
                this.counter++;
            };
            a.on({
                "hello" : increment,
                "bye" : increment,
                "thanks" : increment
            }, a);

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);
        });

    });
    describe("off method", function(){
        var a, add, minus;
        beforeEach(function(){
            a = _.extend({
                counter1: 0,
                counter2: 0
            }, Backbone.Events);
            add = function(){
                this.counter1++;
            };
            minus = function(){
                this.counter2--;
            };
        });
        it("removes all callbacks on specific event", function(){
            a.on("change", add , a);
            a.on("change", minus, a);

            a.trigger("change");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);

            a.off("change");
            a.trigger("change");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);
        });
        it("removes specific callback from an event", function(){
            a.on("change", add , a);
            a.on("change", minus, a);

            a.trigger("change");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);

            a.off("change", add);
            a.trigger("change");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-2);
        });
        it("removes specific callback from all events", function(){
            a.on({
                "change" : add,
                "update" : add
            }, a);

            a.trigger("change");
            expect(a.counter1).toEqual(1);
            a.trigger("update");
            expect(a.counter1).toEqual(2);

            a.off(null, add);
            a.trigger("change update");
            expect(a.counter1).toEqual(2);
        });
        it("removes all callbacks for context for all events", function(){
            var b = _.extend({
                counter1: 0,
                counter2: 0
            }, Backbone.Events);

            a.on("change", add , a);
            a.on("minus", minus, a);
            a.on("update", add , b);
            a.trigger("change");
            a.trigger("minus");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);
            a.trigger("update");
            expect(b.counter1).toEqual(1);

            a.off(null, null, a);
            a.trigger("change");
            a.trigger("minus");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);
            a.trigger("update");
            expect(b.counter1).toEqual(2);
        });
        it("removes all callbacks from an object", function(){
            a.on({
                "add" : add,
                "minus" : minus
            }, a);

            a.trigger("add");
            expect(a.counter1).toEqual(1);
            a.trigger("minus");
            expect(a.counter2).toEqual(-1);

            a.off();
            a.trigger("add");
            expect(a.counter1).toEqual(1);
            a.trigger("minus");
            expect(a.counter2).toEqual(-1);
        });

    });
    describe("trigger method", function(){
        var a, add, minus;
        beforeEach(function(){
            a = _.extend({
                counter1: 0,
                counter2: 0
            }, Backbone.Events);

            add = function(){
                this.counter1++;
            };

            minus = function(){
                this.counter2--;
            };
        });

        it("trigger callbacks for given event", function(){
            a.on({
                "add" : add,
                "minus" : minus
            }, a);

            a.trigger("add");
            expect(a.counter1).toEqual(1);
            a.trigger("minus");
            expect(a.counter2).toEqual(-1);
        });
        it("trigger callbacks for given event times", function(){
            a.on("add", add, a);

            a.trigger("add");
            a.trigger("add");
            a.trigger("add");
            expect(a.counter1).toEqual(3);
        });
        it("trigger callbacks for space-delimited list of events", function(){
            a.on({
                "add" : add,
                "minus" : minus
            }, a);

            a.trigger("add minus");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(-1);
        });
        it("trigger callbacks for given event, and passed same arguments to callbacks", function(){
            var addAll = function(){
                var ret = 0;
                for(var i=0, len=arguments.length; i<len; i++){
                    ret = ret + arguments[i];
                }
                this.counter1 = ret;
            };
            a.on("addAll", addAll, a);

            a.trigger("addAll",1,2,3,4,5);
            expect(a.counter1).toEqual(15);
        });
    });
    describe("once method", function(){
        var a;
        beforeEach(function(){
            a = _.extend({
                counter:0
            }, Backbone.Events);
        });

        it("can bind a callback and only be triggered once",function(){
            a.once("event", function(){
                a.counter++;
            });

            a.trigger("event");
            expect(a.counter).toEqual(1);
            a.trigger("event");
            expect(a.counter).toEqual(1);
        });

        it("can bind a callback with context and only be triggered once", function(){
            var increment = function(){
                this.counter++;
            };
            a.once("event", increment, a);

            a.trigger("event");
            a.trigger("event");
            expect(a.counter).toEqual(1);
        });

        it("can bind a callback to all, but only be triggered once", function(){
            a.once("all", function(){
                a.counter++;
            });

            a.trigger("anything");
            expect(a.counter).toEqual(1);

            a.trigger("other");
            expect(a.counter).toEqual(1);
        });

        it("can bind a callback to mutiple events", function(){
            a.once("hello bye thanks", function(){
                a.counter++;
            });

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);

            a.trigger("hello bye thanks");
            expect(a.counter).toEqual(3);
        });

        it("can bind callback with event maps", function(){
            a.once({
                "hello" : function(){
                    a.counter++;
                },
                "bye" : function(){
                    a.counter++;
                },
                "thanks" : function(){
                    a.counter++;
                }
            });

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);

            a.trigger("hello bye thanks");
            expect(a.counter).toEqual(3);
        });

        it("can bind callback with event maps and context", function(){
            var increment = function(){
                this.counter++;
            };
            a.once({
                "hello" : increment,
                "bye" : increment,
                "thanks" : increment
            }, a);

            a.trigger("hello");
            expect(a.counter).toEqual(1);
            a.trigger("bye");
            expect(a.counter).toEqual(2);
            a.trigger("thanks");
            expect(a.counter).toEqual(3);

            a.trigger("hello bye thanks");
            expect(a.counter).toEqual(3);
        });
    });

    describe("listenTo method", function(){
        var a, b;
        beforeEach(function(){
            a = _.extend({
                counter1 : 0,
                counter2 : 0,
                counter3 : 0,
                action1 : function(){
                    this.counter1 += 1;
                },
                action2 : function(){
                    this.counter2 += 1;
                },
                action3 : function(){
                    this.counter3 += 1;
                }
            }, Backbone.Events);
            b = _.extend({}, Backbone.Events);
        });

        it("can listenTo on objects", function(){
            a.listenTo(b, "event1", a.action1);
            a.listenTo(b, "event2", a.action2);
            a.listenTo(b, "event3", a.action3);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(2);
            expect(a.counter2).toEqual(2);
            expect(a.counter3).toEqual(2);
        });

        it("can listenTo on objects with event maps", function(){
            a.listenTo(b, {
                event1: a.action1,
                event2: a.action2,
                event3: a.action3
            });

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(2);
            expect(a.counter2).toEqual(2);
            expect(a.counter3).toEqual(2);
        });

        it("can listenTo all on objects.", function(){
            a.listenTo(b, "all", a.action1);
            b.trigger("anything");
            expect(a.counter1).toEqual(1);

            b.trigger("other");
            expect(a.counter1).toEqual(2);
        });
    });

    describe("listenToOnce method", function(){
        var a, b;
        beforeEach(function(){
            a = _.extend({
                counter1 : 0,
                counter2 : 0,
                counter3 : 0,
                action1 : function(){
                    this.counter1 += 1;
                },
                action2 : function(){
                    this.counter2 += 1;
                },
                action3 : function(){
                    this.counter3 += 1;
                }
            }, Backbone.Events);
            b = _.extend({}, Backbone.Events);
        });

       it("can listenToOnce on objects", function(){
            a.listenToOnce(b, "event1", a.action1);
            a.listenToOnce(b, "event2", a.action2);
            a.listenToOnce(b, "event3", a.action3);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);
       });

       it("can listenToOnce on objects with event maps", function(){
            a.listenToOnce(b, {
                event1: a.action1,
                event2: a.action2,
                event3: a.action3
            });

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);
       });

       it("can listenToOnce all on objects.", function(){
            a.listenToOnce(b, "all", a.action1);
            b.trigger("anything");
            expect(a.counter1).toEqual(1);

            b.trigger("other");
            expect(a.counter1).toEqual(1);
       });
    });

    describe("stopListeing method", function(){
        var a, b, c;
        beforeEach(function(){
            a = _.extend({
                counter1 : 0,
                counter2 : 0,
                counter3 : 0,
                action1 : function(){
                    this.counter1 += 1;
                },
                action2 : function(){
                    this.counter2 += 1;
                },
                action3 : function(){
                    this.counter3 += 1;
                }
            }, Backbone.Events);
            b = _.extend({}, Backbone.Events);
            c = _.extend({}, Backbone.Events);
        });

        it("will remove all registed callbacks with no arguments", function(){
            a.listenTo(b, {
                event1: a.action1,
                event2: a.action2,
                event3: a.action3
            });
            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            a.stopListening();
            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);
        });

        it("will remove registed on a specific object", function(){
            a.listenTo(b, {
                event1: a.action1,
                event2: a.action2
            });
            a.listenTo(c, {
                event3: a.action3
            });

            b.trigger("event1 event2");
            c.trigger("event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            a.stopListening(b);
            b.trigger("evnet1 event2");
            c.trigger("event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(2);
        });

        it("will remove specific event", function(){
            a.listenTo(b, {
                event1: a.action1,
                event2: a.action2,
                event3: a.action3
            });

            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            a.stopListening(b, "event1");
            b.trigger("event1 event2 event3");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(2);
            expect(a.counter3).toEqual(2);
        });

        it("will remove specific callbacks", function(){
            a.listenTo(b, "event1", a.action1);
            a.listenTo(b, "event1", a.action2);
            a.listenTo(b, "event1", a.action3);

            b.trigger("event1");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(1);
            expect(a.counter3).toEqual(1);

            a.stopListening(b, "event1", a.action1);
            b.trigger("event1");
            expect(a.counter1).toEqual(1);
            expect(a.counter2).toEqual(2);
            expect(a.counter3).toEqual(2);
        });
    });

});
