<template>


  <q-tab-panels v-model="uiStore.deviceEsp32Tab" class="bg-transparent col">
    <q-tab-panel name="main">
      <q-scroll-area class="fit">
        <CodeContent :content="codeMain"/>
      </q-scroll-area>
    </q-tab-panel>

    <q-tab-panel name="debug_inputs">
      <q-scroll-area class="fit">
        <CodeContent :content="codeDebugInputs"/>
      </q-scroll-area>
    </q-tab-panel>

    <q-tab-panel name="debug_outputs">
      <q-scroll-area class="fit">
        <CodeContent :content="codeDebugOutputs"/>
      </q-scroll-area>
    </q-tab-panel>
  </q-tab-panels>

  <q-tabs
    v-model="uiStore.deviceEsp32Tab"
    dense
    narrow-indicator
    no-caps
    class="bg-white"
  >
    <q-tab name="main" label="Main"/>
    <q-tab name="debug_inputs" label="Debug inputs"/>
    <q-tab name="debug_outputs" label="Debug outputs"/>
  </q-tabs>

</template>
<script setup lang="ts">
import {computed, defineProps} from "vue";
import {useUiStore} from "stores/ui";
import CodeContent from "components/CodeContent.vue";
import {stringify} from 'yaml'

const {device} = defineProps<{
  device: DeviceModel;
}>();
const uiStore = useUiStore();

const template = {
  "esphome": {
    "name": "controller01"
  },
  "esp32": {
    "board": "nodemcu-32s",
    "framework": {
      "type": "esp-idf"
    }
  },
  "wifi": {
    "ssid": "!secret wifi_ssid",
    "password": "!secret wifi_password",
    "ap": {
      "ssid": "controller01 hotspot",
      "password": "!secret wifi_password"
    },
    "power_save_mode": "none",
    "use_address": "controller01.home"
  },
  "captive_portal": {},
  "logger": {
    "baud_rate": 0,
    "level": "INFO"
  },
  "api": {
    "encryption": {
      "key": "!secret api_encryption_key"
    }
  },
  "ota": [
    {
      "platform": "esphome",
      "password": "!secret ota_password"
    }
  ],
  "i2c": {
    "scan": true
  },
  "mcp23017": [
    {
      "id": "mcp23017_hub_0",
      "address": "0x20"
    },
    {
      "id": "mcp23017_hub_1",
      "address": "0x21"
    },
    {
      "id": "mcp23017_hub_2",
      "address": "0x22"
    },
    {
      "id": "mcp23017_hub_3",
      "address": "0x23"
    },
    {
      "id": "mcp23017_hub_4",
      "address": "0x24"
    },
    {
      "id": "mcp23017_hub_5",
      "address": "0x25"
    },
    {
      "id": "mcp23017_hub_6",
      "address": "0x26"
    },
    {
      "id": "mcp23017_hub_7",
      "address": "0x27"
    }
  ]
}

const baseTemplate = () => {
  const code = JSON.parse(JSON.stringify(template))
  code.esphome.name = device.id
  code.wifi.ap.ssid = `${device.id} hotspot`
  code.wifi.use_address = `${device.id}.home`
  return code
}

const codeMain = computed(() => {
  const out = baseTemplate();
  return toEscapedYaml(out)
})


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toEscapedYaml = (obj: any) => {
  let yaml = stringify(obj);
  yaml = yaml.replace(/"!secret (.*)"/gi, "!secret $1");
  return yaml;
}

const codeDebugInputs = computed(() => {
  const out = baseTemplate();
  out.binary_sensor = []
  for (let i = 0; i < 128; i++) {
    const mcpId = "mcp23017_hub_" + Math.floor(i / 16);
    const pinNumber = i % 16;
    out.binary_sensor.push({
      platform: "gpio",
      id: `IN_${i}_${mcpId}_${pinNumber}`,
      pin: {
        mcp23xxx: mcpId,
        number: pinNumber,
        mode: "INPUT_PULLUP",
      }
    })
  }
  return toEscapedYaml(out)
})
const codeDebugOutputs = computed(() => {
  const out = baseTemplate();
  out.switch = []
  for (let i = 0; i < 128; i++) {
    const mcpId = "mcp23017_hub_" + Math.floor(i / 16);
    const pinNumber = i % 16;
    out.switch.push({
      platform: "gpio",
      id: `OUT_${i}_${mcpId}_${pinNumber}`,
      name: `OUT_${i}_${mcpId}_${pinNumber}`,
      pin: {
        mcp23xxx: mcpId,
        number: pinNumber,
        mode: "OUTPUT",
        inverted: false
      }
    })
  }
  return toEscapedYaml(out)
})
</script>
<style scoped>

</style>
