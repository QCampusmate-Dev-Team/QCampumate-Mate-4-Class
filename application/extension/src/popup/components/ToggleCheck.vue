<template>
  <div class="switch" :class="onOffClass" @click="toggle">
    <div class="toggle"></div>
      <span class="on">ON</span> 
      <span class="off">OFF</span> 
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
  interface ToggleProps {
    value?: boolean
  }
  
  const props = withDefaults(defineProps<ToggleProps>(), {
    value: true
  })

  const checked = ref(props.value)

  const onOffClass = computed(() => {
    return checked.value ? 'off' : 'on'
  })

  const emit = defineEmits(['toggled'])

  function toggle () {
    checked.value = !checked.value
    emit('toggled', checked.value)
  }
</script>

<style scoped>
.switch {
	position: relative;
	display: inline-block;
	font-size: 1.6em;
	/* font-weight: bold; */
	color: rgb(176, 176, 176);
	/* text-shadow: 0px 1px 1px rgba(255,255,255,0.8); */
	height: 19px;
	padding: 6px 6px 5px 6px;
	/* border: 1px solid #ccc;
	border: 1px solid rgba(0,0,0,0.8); */
	border-radius: 4px;
	background: #dedede;
	/* box-shadow: 0px 0px 4px rgba(0,0,0,0.1), inset 0px 1px 3px 0px rgba(0,0,0,0.1); */
	cursor: pointer;
	font-size: 16px;
}


.switch span {
	display: inline-block;
	width: 36px;
  text-align: center;
}
.switch span.on { color: #fff }
.switch .toggle {
	position: absolute;
	top: 2px;
	width: 37px;
	height: 26px;
	border-radius: 4px;
	background: rgb(39, 37, 37);
	background: -moz-linear-gradient(top, #ececec 0%, #ffffff 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ececec), color-stop(100%, #ffffff));
	background: -webkit-linear-gradient(top, #ececec 0%, #ffffff 100%);
	background: -o-linear-gradient(top, #ececec 0%, #ffffff 100%);
	background: -ms-linear-gradient(top, #ececec 0%, #ffffff 100%);
	background: linear-gradient(top, #ececec 0%, #ffffff 100%);
	/* box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.5); */
	z-index: 999;
  transition: all 0.2s ease-in-out;
	-webkit-transition: all 0.15s ease-in-out;
	-moz-transition: all 0.15s ease-in-out;
	-o-transition: all 0.15s ease-in-out;
	-ms-transition: all 0.15s ease-in-out;
}
.switch.off {
  background: #000000;
}
.switch.on .toggle { left: 2.5%; }
.switch.off .toggle { left: 53.5%; } 
/* left: 52%; */


</style>