Vue.component('esp-code', {
    props: ['controller'],
    data: function(){
        return {
            init: {
                "esphome": {
                    "name": "esp_01",
                    "platform": "ESP32",
                    "board": "nodemcu-32s"
                },
                "wifi": {
                    "ssid": '!secret wifi_ssid',
                    "password": '!secret wifi_password',
                    "ap": {
                        "ssid": "esp_01 Fallback Hotspot",
                        "password": '!secret wifi_password'
                    },
                    "power_save_mode": "none",
                    "manual_ip":{
                        "static_ip": "192.168.88.5",
                        "gateway": "192.168.88.1",
                        "subnet": "255.255.255.0"
                    }
                },
                "captive_portal": {},
                "logger": {
                    "baud_rate": 0,
                    "level": "INFO"
                },
                "api": {
                    "password": '!secret api_password'
                },
                "ota": {
                    "password": '!secret ota_password'
                }
            }
        };
    },

    computed: {
        'switch': function(){
            return this.controller.ports
                .filter(port => port.entity && port.entity.$direction.id == 'output')
                .map(port => {
                    const out = {
                        platform: "gpio",
                        id: "OUT_"+port.entity.id,
                        name: this.nameForPort(port),
                        pin: {
                            number: this.getSlotPort(port),
                            mode: "OUTPUT",
                            inverted: false
                        }
                    }
                    if(this.isExpanded){
                        out.pin.mcp23017 = this.getHubForPort(port.index);
                    }
                    return out;
                });
        },
        binary_sensor: function(){
            return this.controller.ports
                .filter(port => port.entity && port.entity.$direction.id == 'input')
                .map(port => {
                    const out = {
                        platform: "gpio",
                        id: "IN_"+port.entity.id,
                        name: this.nameForPort(port),
                        pin: {
                            number: this.getSlotPort(port),
                            mode: "INPUT_PULLUP",
                            inverted: true
                        }
                    }
//                    console.log(port);
                    Object.entries(port && port.entity && port.entity.actions || []).forEach(actionEntry => {
                        const actionKey = actionEntry[0];
                        const actionValue = actionEntry[1];
//                        console.log(actionKey, actionValue);

                        if(actionKey == 'push'){
                            const actions = actionValue.map(action => {
                                const actionEntry = Object.entries(action)[0];
                                const key = 'switch.'+actionEntry[0];
                                const value = actionEntry[1] || null;
                                console.log(key, value);
                                const out = {}
                                out[key] = 'OUT_'+value;
                                return out;
                            });
                            out.on_press = {
                                then: actions
                            }
                        }
                    });
                    if(this.isExpanded){
                        out.pin.mcp23017 = this.getHubForPort(port.index);
                    }
                    return out;
                });
        },
        mcp23017: function(){
            const count = this.controller.slots / 16
            return [...Array(count).keys()]
                .map(index => {
                    return {
                        id: 'mcp23017_hub_' + index,
                        address: '0x' + (20 + index)
                    }
                });
        },
        isExpanded: function(){
            const device = this.controller.device;
            return device == 'esp64' || device == 'esp128';
        },
        code: function(){
            const code = Object.assign({},this.init);
            code.esphome.name = this.controller.id;
            code.wifi.ap.ssid = this.controller.id + ' hotspot';
            code.wifi.manual_ip.static_ip = this.controller.ip;

            if(this.isExpanded){
                code.i2c = {scan: true};
                code.mcp23017 = this.mcp23017;
            }

            code['switch'] = this['switch'];
            code.binary_sensor = this.binary_sensor;
            return jsyaml.safeDump(code)
                .replace(/'!secret (.*)'/gi,"!secret $1");
        },
    },
    methods: {
        getHubForPort: function(port){
            return 'mcp23017_hub_'+Math.floor((port / 16));
        },
        getSlotPort: function(port){
            return this.isExpanded ? port.index % 16 : port.id;
        },
        nameForPort: function(port){
            const entity = port.entity;
            return entity.$type.label + " : " + entity.$place.label + " : " + entity.$location.label + ' ('+entity.id+')';
        },
        copyToClipboard: function(){
              navigator.clipboard.writeText(this.code).then(function() {
              }, function() {
              });
        }
    },
    template: `
        <div>
            <button type="button" @click="copyToClipboard()">Kopiuj</button>
            <code><pre>{{code}}</pre></code>
        </div>
    `
})