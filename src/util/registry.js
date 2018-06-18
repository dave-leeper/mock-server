function Registry(){};
Registry.registry = [];
Registry.register = function(object, name) {
    Registry.registry.unshift({object: object, name: name})
};
Registry.unregister = function(name) {
    for (let loop = 0; loop < Registry.registry.length; loop++) {
        if (Registry.registry[loop].name === name) {
            let object = Registry.registry[loop].object;
            Registry.registry.splice(loop, 1);
            return object;
        }
    }
    return null;
};
Registry.unregisterAll = function() {
    Registry.registry = [];
};
Registry.isRegistered = function(name) {
    for (let loop = 0; loop < Registry.registry.length; loop++) {
        if (Registry.registry[loop].name === name) return true;
    }
    return false;
};
Registry.get = function(name) {
    for (let loop = 0; loop < Registry.registry.length; loop++) {
        if (Registry.registry[loop].name === name) return Registry.registry[loop].object;
    }
    return null;
};

module.exports = Registry;
