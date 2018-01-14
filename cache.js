(function (exp) {
    // default timeout - 5s
    const DEF_TIMEOUT = 5 * 1000;
    const DEF_NAME = "cache";
    // arbitrary limit to run GC
    const GC_LIMIT = 2000;

    const garbageCollector = innerData => {
        Object.keys(innerData.data).forEach(key => {
            if (innerData.isExpiredOrUndf(innerData.data[key])) {
                delete innerData.data[key];
            }
        });
        innerData.gcCount = 0;
    };

    // Constructor for Cache Object
    const CacheObj = value => ({
        value,
        time: new Date().getTime(),
        refresh() { this.time = new Date().getTime(); }
    });

    // Complexity O(log N)
    const makeGet = (innerData) => function get(key) {
        const cacheObj = innerData.data[key];
        const expiredOrUndf = innerData.isExpiredOrUndf(cacheObj);
        if (expiredOrUndf) {
            innerData.missed++;
            cacheObj && delete innerData.data[key];
            innerData.gcCount--;
            return undefined;
        }
        cacheObj.refresh();
        innerData.hit++;
        return cacheObj.value;
    };

    // Complexity O(log N)
    const makePut = (innerData) => function put(key, value) {
        innerData.data[key] = CacheObj(value);
        innerData.gcCount++;
        innerData.gcCount > GC_LIMIT && garbageCollector(innerData);
    };

    // Complexity O(2log N)
    const makePutIfAbsent = (innerData) => function putIfAbsent(key, value) {
        if (!this.contains(key)) {
            this.put(key, value);
            innerData.missed--;
        } else {
            innerData.hit++;
        }
    };

    // Complexity O(log N)
    const contains = function (key) {
        return Boolean(this.get(key));
    };

    // Complexity O(N)
    const makeCount = (innerData) => function count() {
        return Object.values(innerData.data).filter(obj => !innerData.isExpiredOrUndf(obj)).length;
    };

    const VCache = function VCache(timeout = DEF_TIMEOUT, name = DEF_NAME) {
        // Clojure
        const innerData = {
            hit: 0,
            missed: 0,
            isExpiredOrUndf(cacheObj) {
                const now = new Date().getTime();
                return !Boolean(cacheObj) || (now - cacheObj.time > timeout);
            },
            gcCount: 0,
            data: {}
        };
        return {
            get: makeGet(innerData),
            put: makePut(innerData),
            count: makeCount(innerData),
            putIfAbsent: makePutIfAbsent(innerData),
            contains,
            // Complexity O(1)
            getMissed: function getMissed() { return innerData.missed; },
            // Complexity O(1)
            getHit: function getHit() { return innerData.hit; },
            // Complexity O(1)
            getTimeout: function getTimeout() { return timeout; },
            // Complexity O(1)
            getName: function getName() { return name; }
        };
    };

    exp.VCache = VCache;
})(typeof exports === 'undefined' ? this : exports);
