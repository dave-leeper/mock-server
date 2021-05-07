(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["680a22e3"],{"0ff4":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("q-page",{staticClass:"flex flex-center Page"},[r("BasicInfo",{attrs:{starting_name:e.getToonName,archetype_id:e.getToonArchetypeId,primary_name:e.getPrimaryPowerSetName,secondary_name:e.getSecondaryPowerSetName},on:{"power-set-clicked":e.showPowerSetPicker}}),r("Build",{on:{"selected-build":e.doBuildClicked}}),r("PowerEntryGrid",{on:{"power-clicked":e.doPowerClicked}}),r("PowerSetPicker",{class:e.getPowerSetPickerClass,on:{"power-set-picker-select":e.doPowerSetPickerSelectClick,"power-set-picker-cancel":e.doPowerSetPickerCancelClick}}),r("PowerPicker",{class:e.getPowerPickerClass,attrs:{availablePowerSets:e.availablePowerSets,powerLevel:e.powerLevel,powerEntry:e.powerEntry},on:{"power-picker-select":e.doPowerPickerSelectClick,"power-picker-cancel":e.doPowerPickerCancelClick}})],1)},o=[],s=r("967e"),i=r.n(s),l=(r("96cf"),r("fa84")),a=r.n(l),c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"BasicInfo"},[r("div",[r("TextInput",{staticClass:"BasicInfoName",attrs:{dense:!0,hidebottomspace:!0,id:"toon_name",initial_value:e.starting_name,label:"Name"},on:{"text-input-changed-event":e.doNameChanged}})],1),r("div",{staticClass:"BasicInfoArchetypeAndLevel"},[r("Label",{staticClass:"BasicInfoArchetype",attrs:{text:e.archetype_name,size:"small",color:"alt"}}),r("Label",{staticClass:"BasicInfoLevel",attrs:{text:e.getLevel,size:"small",color:"alt"}})],1),r("Label",{staticClass:"BasicInfoPrimaryAndSecondaryPowerSets",attrs:{text:e.getPowerSetNames,size:"small",color:"alt"},on:{click:e.doPowerSetClicked}})],1)},u=[],d=(r("6b54"),r("06db"),r("8641")),p=r("446e"),w={name:"BasicInfo",components:{Label:d["a"],TextInput:p["a"]},created:function(){this.getArchetypeName()},props:{starting_name:{type:String,default:""},archetype_id:{type:String,default:""},primary_name:{type:String,default:""},secondary_name:{type:String,default:""}},data:function(){return{name:this.starting_name,archetype_name:this.starting_archetype_id}},computed:{getPowerSetNames:function(){return this.primary_name?this.primary_name+"/"+this.secondary_name:"Tap to set Primary/Secondary"},getLevel:function(){return this.$store.getters["builder/getToon"].level.toString()}},methods:{doNameChanged:function(e){this.$store.commit("builder/toonSetName",e)},doPowerSetClicked:function(){this.$emit("power-set-clicked","")},getArchetypeName:function(){var e=this.$store.getters["builder/getArchetype"](this.archetype_id);this.archetype_name=e.display_name}}},_=w,h=(r("8c6f"),r("2877")),P=Object(h["a"])(_,c,u,!1,null,"6e66bc28",null),m=P.exports,f=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"Build"},[r("div",{staticClass:"BuildButtons"},[r("SVGCircleButton",{class:e.getBuild1Class,attrs:{text:"1",text_x:"8"},nativeOn:{click:function(t){return e.onBuild1Clicked(t)}}}),r("SVGCircleButton",{class:e.getBuild2Class,attrs:{text:"2",text_x:"8"},nativeOn:{click:function(t){return e.onBuild2Clicked(t)}}}),r("SVGCircleButton",{class:e.getBuild3Class,attrs:{text:"3",text_x:"8"},nativeOn:{click:function(t){return e.onBuild3Clicked(t)}}})],1),r("Label",{staticClass:"BuildText",attrs:{text:"Build",size:"small",color:"alt"}})],1)},g=[],y=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("svg",{attrs:{height:e.getHeight,width:e.getWidth}},[r("circle",{attrs:{cx:e.getCX,cy:e.getCY,r:e.getR,stroke:"var(--svg-circle-stroke)","stroke-width":"var(--svg-circle-stroke-width)",fill:"var(--svg-circle-fill)","stroke-dasharray":"var(--svg-circle-stroke-dasharray)"}}),r("text",{attrs:{"dominant-baseline":"var(--svg-text-dominant-baseline)","text-anchor":"var(--svg-text-anchor)",x:e.getTextX,y:e.getTextY,fill:"var(--svg-text-fill)","font-family":"var(--svg-text-font-family)","font-size":"var(--svg-text-font-size)","font-weight":"var(--svg-text-font-weight)","stroke-width":"var(--svg-text-stroke-width)"}},[e._v("\n        "+e._s(e.getText)+"\n    ")])])},S=[],v=(r("c5f6"),{name:"SVGCircleButton",props:{width:{type:Number,default:25},height:{type:Number,default:25},cx:{type:Number,default:12},cy:{type:Number,default:12},r:{type:Number,default:10},text:{type:String,default:"i"},text_x:{type:String,default:"10"},text_y:{type:String,default:"17"}},computed:{getWidth:function(){return"string"===typeof this.width?Number(this.width):this.width},getHeight:function(){return"string"===typeof this.height?Number(this.height):this.height},getCX:function(){return"string"===typeof this.cx?Number(this.cx):this.cx},getCY:function(){return"string"===typeof this.cy?Number(this.cy):this.cy},getR:function(){return"string"===typeof this.r?Number(this.r):this.r},getText:function(){return this.text},getTextX:function(){return this.text_x},getTextY:function(){return this.text_y}}}),b=v,C=Object(h["a"])(b,y,S,!1,null,null,null),k=C.exports,x={components:{Label:d["a"],SVGCircleButton:k},name:"Build",computed:{getBuild1Class:function(){return 0===this.$store.getters["builder/getToonCurrentBuildNumber"]?"BuildSelected":"BuildNotSelected"},getBuild2Class:function(){return 1===this.$store.getters["builder/getToonCurrentBuildNumber"]?"BuildSelected":"BuildNotSelected"},getBuild3Class:function(){return 2===this.$store.getters["builder/getToonCurrentBuildNumber"]?"BuildSelected":"BuildNotSelected"}},methods:{onBuild1Clicked:function(){this.buildClicked(0)},onBuild2Clicked:function(){this.buildClicked(1)},onBuild3Clicked:function(){this.buildClicked(2)},buildClicked:function(e){this.$emit("selected-build",0),this.$store.commit("builder/toonSelectBuild",e)}}},T=x,N=(r("fcc7"),Object(h["a"])(T,f,g,!1,null,"0bfc829e",null)),E=N.exports,B=r("ed0b"),O=r("a7ee"),I=r("d5eb"),$=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{key:e.getCurrentBuildNumber,staticClass:"PowerEntryRows"},e._l(e.getColumnCount,(function(t){return r("span",{key:t,staticClass:"PowerEntryColumns"},e._l(e.getPowerEntriesPerColumn,(function(n){return r("span",{key:(t-1)*e.getPowerEntriesPerColumn+(n-1)},[(t-1)*e.getPowerEntriesPerColumn+(n-1)<e.getPowerEntryCount?r("PowerEntry",{staticClass:"PowerEntry",attrs:{power_entry:e.getPowerEntry((t-1)*e.getPowerEntriesPerColumn+(n-1))},on:{"power-clicked":e.doPowerClicked}}):e._e()],1)})),0)})),0)])},R=[],L=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"PowerEntry",class:e.isNoPower?"Rise":"",on:{click:e.doClick}},[r("div",{staticClass:"PowerBar",class:e.getPowerBarClass},[r("PowerText",{attrs:{power_set_type:e.getPowerSetType,power_name:e.getPowerName,power_level:e.getPowerLevel}}),r("SVGCircleButton",{class:e.getPowerBarInfoButtonClass})],1),r("EnhancementSlotRow",{staticClass:"PowerEntrySlotRow",attrs:{power_set_type:e.getPowerSetType}})],1)},A=[],V=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"SlotRow"},[r("EnhancementSlot",{class:e.getSlotClass(1),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(1),slot_level:e.slot1_slot_level,enhancement_level:e.slot1_enhancement_level}}),r("EnhancementSlot",{class:e.getSlotClass(2),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(2),slot_level:e.slot2_slot_level,enhancement_level:e.slot2_enhancement_level}}),r("EnhancementSlot",{class:e.getSlotClass(3),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(3),slot_level:e.slot3_slot_level,enhancement_level:e.slot3_enhancement_level}}),r("EnhancementSlot",{class:e.getSlotClass(4),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(4),slot_level:e.slot4_slot_level,enhancement_level:e.slot4_enhancement_level}}),r("EnhancementSlot",{class:e.getSlotClass(5),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(5),slot_level:e.slot5_slot_level,enhancement_level:e.slot5_enhancement_level}}),r("EnhancementSlot",{class:e.getSlotClass(6),attrs:{power_set_type:e.getPowerSetType,slot_state:e.getSlotState(6),slot_level:e.slot6_slot_level,enhancement_level:e.slot6_enhancement_level}})],1)},W=[],D=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"SlotBadgeColumn"},[r("div",{class:e.getLevelBadgeClass},[e._v(e._s(e.slot_level))]),r("SVGCircleButton",{staticClass:"Slot",class:e.getSlotClass,attrs:{width:40,height:40,cx:20,cy:20,r:19,text:e.slotsRemaining,text_x:"12",text_y:"24"}}),r("div",{class:e.getEnhancemenBadgeClass},[e._v(e._s(e.enhancement_level))])],1)])},j=[],z=r("2a6a"),G={NO_POWER:"NO_POWER",UNSLOTTED:"Unslotted",SLOTTED:"Slotted",ENHANCEMENT:"Enhancement"},H={components:{SVGCircleButton:k},name:"EnhancementSlot",props:{slot_level:{type:Number,default:0},enhancement_level:{type:Number,default:0},power_set_type:{type:String,default:z["a"].NO_POWER},slot_state:{type:String,default:G.NO_POWER},slots_remaining:{type:Number,default:0},show_slots_remaining:{type:Boolean,default:!0}},computed:{getSlotClass:function(){var e="";return this.power_set_type===z["a"].NO_POWER||this.slot_state===G.NO_POWER?e="SlotNoPower":this.slot_state===G.UNSLOTTED?e="SlotNoPowerRise":this.power_set_type===z["a"].PRIMARY?e="SlotPrimary":this.power_set_type===z["a"].SECONDARY?e="SlotSecondary":this.power_set_type===z["a"].POOL?e="SlotPool":this.power_set_type===z["a"].EPIC?e="SlotEpic":this.power_set_type===z["a"].INHERENT&&(e="SlotInherent"),e},getLevelBadgeClass:function(){return 0===this.slot_level?"Hidden":"SlotLevelBadge"},getEnhancemenBadgeClass:function(){return 0===this.enhancement_level?"Hidden":"SlotEnhancementBadge"},slotsRemaining:function(){return 0!==this.slots_remaining&&this.show_slots_remaining&&this.power_set_type===z["a"].NO_POWER?this.slots_remaining:""}}},U=H,Y=(r("9549"),Object(h["a"])(U,D,j,!1,null,"30d60ba7",null)),q=Y.exports,M={components:{EnhancementSlot:q},name:"EnhancementSlotRow",props:{power_set_type:{type:String,default:z["a"].NO_POWER},slot1_slot_level:{type:Number,default:0},slot1_enhancement_level:{type:Number,default:0},slot2_slot_level:{type:Number,default:0},slot2_enhancement_level:{type:Number,default:0},slot3_slot_level:{type:Number,default:0},slot3_enhancement_level:{type:Number,default:0},slot4_slot_level:{type:Number,default:0},slot4_enhancement_level:{type:Number,default:0},slot5_slot_level:{type:Number,default:0},slot5_enhancement_level:{type:Number,default:0},slot6_slot_level:{type:Number,default:0},slot6_enhancement_level:{type:Number,default:0}},computed:{slotsRemaining:function(){return 62},getPowerSetType:function(){return this.power_set_type},getSlotCount:function(){return this.slot6_slot_level>0?6:this.slot5_slot_level>0?5:this.slot4_slot_level>0?4:this.slot3_slot_level>0?3:this.slot2_slot_level>0?2:this.slot1_slot_level>0?1:0}},methods:{getSlotClass:function(e){if(this.power_set_type===z["a"].NO_POWER)return"";var t=this.getSlotCount+2;return e<=t?"":"Hidden"},getSlotState:function(e){var t=G.UNSLOTTED;return this.power_set_type===z["a"].NO_POWER&&(t=G.NO_POWER),1===e||e<=this.getSlotCount?t=G.SLOTTED:e<=6&&e===this.getSlotCount+2&&(t=G.UNSLOTTED),t}}},J=M,X=(r("3bfd"),Object(h["a"])(J,V,W,!1,null,"e1893a86",null)),F=X.exports,K=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"PowerText",on:{click:e.doClick}},[r("Label",{staticClass:"PowerTextName",attrs:{text:e.power_name,size:"small",color:"default",disabled:e.getDisabled}}),r("Label",{staticClass:"PowerTextLevel",attrs:{text:e.power_level,size:"small",color:"default",disabled:e.getDisabled}})],1)},Q=[],Z={name:"PowerText",components:{Label:d["a"]},props:{power_name:{type:String,default:""},power_level:{type:String,default:"0"},power_set_type:{type:String,default:z["a"].NO_POWER}},computed:{getDisabled:function(){var e=this.power_set_type;return this.power_set&&(e=this.power_set.group_name),e===z["a"].NO_POWER},getPowerTextClass:function(){var e="",t=this.power_set_type;return this.power_set&&(t=this.power_set.group_name),t===z["a"].NO_POWER?e="PowerTextNoPower":t===z["a"].PRIMARY?e="PowerTextPrimary":t===z["a"].SECONDARY?e="PowerTextSecondary":t===z["a"].POOL?e="PowerTextPool":t===z["a"].EPIC?e="PowerTextEpic":t===z["a"].INHERENT&&(e="PowerTextInherent"),e}},methods:{doClick:function(){this.$emit("power-entry-event",{power_name:this.power_name,power_level:this.power_level,power_set_type:this.power_set_type})}}},ee=Z,te=(r("94dd"),Object(h["a"])(ee,K,Q,!1,null,"b99d0686",null)),re=te.exports,ne={components:{EnhancementSlotRow:F,PowerText:re,SVGCircleButton:k},name:"PowerEntry",created:function(){var e=a()(i.a.mark((function e(){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}(),props:{power_entry:{type:Object,default:null}},computed:{getCurrentBuildNumber:function(){return this.$store.getters["builder/getToonCurrentBuildNumber"]},getPower:function(){if(!this.power_entry||!this.power_entry.power_entry||""===this.power_entry.power_entry.power_id)return null;var e=this.$store.getters["builder/getPower"](this.power_entry.power_entry.power_id);return e},getPowerBarClass:function(){var e="",t=this.getPowerSetType;return t===z["a"].NO_POWER?e="PowerBarNoPower":t===z["a"].PRIMARY?e="PowerBarPrimary":t===z["a"].SECONDARY?e="PowerBarSecondary":t===z["a"].POOL?e="PowerBarPool":t===z["a"].EPIC?e="PowerBarEpic":t===z["a"].INHERENT&&(e="PowerBarInherent"),e},getPowerBarInfoButtonClass:function(){var e="";return e=this.getPowerSetType===z["a"].NO_POWER?"PowerBarInfoButtonDisabled":"PowerBarInfoButton",e},getPowerLevel:function(){return this.power_entry&&this.power_entry.level?Object(B["b"])(this.power_entry.level).toString():"0"},getPowerName:function(){var e=this.getPower;return e?e.display_name:"Tap to select power."},getPowerSet:function(){var e=this.getPower;if(!e)return null;var t=this.$store.getters["builder/getPowerSet"](e.power_set_id);return t},getPowerSetType:function(){var e=this.getPowerSet;return e?e.set_type:z["a"].NO_POWER},isNoPower:function(){return this.getPowerSetType===z["a"].NO_POWER},slotsRemaining:function(){return 62}},methods:{doClick:function(e){var t=this.getPowerSetType;t!==z["a"].INHERENT&&this.$emit("power-clicked",this.power_entry)}},watch:{getCurrentBuildNumber:function(e,t){this.$forceUpdate()}}},oe=ne,se=(r("cd5f"),Object(h["a"])(oe,L,A,!1,null,"6073534a",null)),ie=se.exports,le={name:"PowerEntryGrid",components:{PowerEntry:ie},updated:function(){},computed:{getCurrentBuildNumber:function(){return this.$store.getters["builder/getToonCurrentBuildNumber"]},getPowerEntryCount:function(){var e=this.$store.getters["builder/getToonSortedPowerEntries"],t=e.length;return t},getColumnCount:function(){return"max_power_entry_columns_4"===this.$mq?4:"max_power_entry_columns_3"===this.$mq?3:"max_power_entry_columns_2"===this.$mq?2:"mobile"===this.$mq?1:"tablet"===this.$mq?3:"laptop"===this.$mq?4:"desktop"===this.$mq?4:1},getPowerEntriesPerColumn:function(e){var t=this.getColumnCount,r=this.getPowerEntryCount,n=Math.ceil(r/t);return n}},methods:{getPowerEntry:function(e){var t=this.$store.getters["builder/getToonSortedPowerEntries"];return t[e]},doPowerClicked:function(e){this.$emit("power-clicked",e)}},watch:{getCurrentBuildNumber:function(e,t){this.$forceUpdate()}}},ae=le,ce=(r("1809"),Object(h["a"])(ae,$,R,!1,null,"6f7b4116",null)),ue=ce.exports,de=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("vue-draggable-resizable",{staticClass:"DraggableWrapper",attrs:{draggable:!0,resizable:!1,handles:[],z:10,w:1,h:1}},[r("div",{staticClass:"Center"},[r("div",{staticClass:"PowerPicker"},[r("div",{staticClass:"PowerPickerTitlebar"},[r("div",{staticClass:"PowerPickerTitle"},[e._v("Select Power For Level "+e._s(e.powerLevel))]),r("SVGCircleButton",{staticClass:"PowerPickerInfoButton"})],1),r("div",{staticClass:"PowerPickerBody"},[r("TextPicker",{attrs:{list:e.availablePowerSets.map((function(e){return e.display_name})),click_event:"selected-power-set",title:"Power Sets"},on:{"selected-power-set":e.doPowerSetClicked}}),r("TextPicker",{attrs:{list:e.availablePowers.map((function(e){return e.display_name})),click_event:"selected-power",title:"Powers"},on:{"selected-power":e.doPowerClicked}})],1),r("div",{staticClass:"PowerPickerButtons"},[r("Button",{staticClass:"PowerPickerButton",attrs:{dense:!0,label:"Cancel",stretch:!0,type:"button"},on:{"button-event":e.onCancelClicked}}),r("Button",{staticClass:"PowerPickerButton",attrs:{dense:!0,disabled:e.getSelectDisabled,label:"Select",stretch:!0,type:"button"},on:{"button-event":e.onSelectClicked}})],1)])])])},pe=[],we=r("2a7d"),_e=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"TextPicker"},[r("div",{staticClass:"TextPickerTitleBar"},[r("div",{staticClass:"TextPickerPowerSetTitle"},[e._v(e._s(e.title))])]),r("div",{staticClass:"TextPickerList"},e._l(e.list,(function(t,n){return r("div",{key:e.getKey(n),class:e.getItemClass(n),on:{click:function(t){return e.doClick(n)}}},[e._v("\n            "+e._s(t)+"\n        ")])})),0)])},he=[],Pe={name:"PowerText",props:{title:{type:String,default:"Title"},click_event:{type:String,default:"selected-item"},list:{type:Array,default:function(){return["Item 1","Item 2","Item 3","Item 4","Item 5","Item 6","Item 7","Item 8"]}}},data:function(){return{currentSelection:-1}},methods:{getItemClass:function(e){return e===this.currentSelection?"TextPickerListItemSelected":"TextPickerListItem"},getKey:function(e){return this.click_event+e},doClick:function(e){this.currentSelection=e,this.$emit(this.click_event,e)}}},me=Pe,fe=(r("7446"),Object(h["a"])(me,_e,he,!1,null,"8e95fbf2",null)),ge=fe.exports,ye=r("fb19"),Se=r.n(ye),ve={components:{Button:we["a"],SVGCircleButton:k,TextPicker:ge,VueDraggableResizable:Se.a},name:"PowerPicker",created:function(){},props:{title:{type:String,default:""},availablePowerSets:{type:Array,default:function(){return[]}},powerLevel:{type:Number,default:0},powerEntry:{type:Object,default:function(){return{}}}},data:function(){return{availablePowers:[],selectedPowerSetIndex:-1,selectedPowerIndex:-1}},computed:{getSelectDisabled:function(){return-1===this.selectedPowerSetIndex||-1===this.selectedPowerIndex}},methods:{doPowerSetClicked:function(e){this.selectedPowerSetIndex=e;var t={powerLevel:this.powerLevel,powerSetId:this.availablePowerSets[e].id};this.availablePowers=this.$store.getters["builder/getToonAllowedPowers"](t)},doPowerClicked:function(e){this.selectedPowerIndex=e},onCancelClicked:function(){this.availablePowers=[],this.selectedPowerSetIndex=-1,this.selectedPowerIndex=-1,this.$emit("power-picker-cancel","")},onSelectClicked:function(){if(-1!==this.selectedPowerSetIndex&&-1!==this.selectedPowerIndex){var e={power_set_index:this.selectedPowerSetIndex,power_set:this.availablePowerSets[this.selectedPowerSetIndex],power_index:this.selectedPowerIndex,power:this.availablePowers[this.selectedPowerIndex]};this.availablePowers=[],this.selectedPowerSetIndex=-1,this.selectedPowerIndex=-1,this.$emit("power-picker-select",e)}}}},be=ve,Ce=(r("e1e5"),Object(h["a"])(be,de,pe,!1,null,"6c12674a",null)),ke=Ce.exports,xe=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("vue-draggable-resizable",{staticClass:"DraggableWrapper",attrs:{draggable:!0,resizable:!1,handles:[],z:10,w:1,h:1}},[r("div",{staticClass:"Center"},[r("div",{staticClass:"PowerSetPicker"},[r("div",{staticClass:"PowerSetPickerTitlebar"},[r("div",{staticClass:"PowerSetPickerTitle"},[e._v("Select Power Sets")]),r("SVGCircleButton",{staticClass:"PowerSetPickerInfoButton"})],1),r("div",{staticClass:"PowerSetPickerBody"},[r("TextPicker",{attrs:{list:e.primaryPowerSets.map((function(e){return e.display_name})),click_event:"selected-primary",title:"Primary"},on:{"selected-primary":e.doPrimaryClicked}}),r("TextPicker",{attrs:{list:e.secondaryPowerSets.map((function(e){return e.display_name})),click_event:"selected-secondary",title:"Secondary"},on:{"selected-secondary":e.doSecondaryClicked}})],1),r("div",{staticClass:"PowerSetPickerButtons"},[r("Button",{staticClass:"PowerSetPickerButton",attrs:{dense:!0,label:"Cancel",stretch:!0,type:"button"},on:{"button-event":e.onCancelClicked}}),r("Button",{staticClass:"PowerSetPickerButton",attrs:{dense:!0,disabled:e.getSelectDisabled,label:"Select",stretch:!0,type:"button"},on:{"button-event":e.onSelectClicked}})],1)])])])},Te=[],Ne={components:{Button:we["a"],SVGCircleButton:k,TextPicker:ge,VueDraggableResizable:Se.a},name:"PowerSetPicker",created:function(){this.fetchPrimaryPowerSets(),this.fetchSecondaryPowerSets()},props:{title:{type:String,default:""}},data:function(){return{primaryPowerSets:[],secondaryPowerSets:[],selectedPrimaryPowerSetIndex:-1,selectedSecondaryPowerSetIndex:-1}},computed:{getSelectDisabled:function(){return-1===this.selectedPrimaryPowerSetIndex||-1===this.selectedSecondaryPowerSetIndex}},methods:{fetchPrimaryPowerSets:function(){var e=this.$store.getters["builder/getToonArchetypeId"];this.primaryPowerSets=this.$store.getters["builder/getPrimaryPowerSetsFromArchetype"](e)},fetchSecondaryPowerSets:function(){var e=this.$store.getters["builder/getToonArchetypeId"];this.secondaryPowerSets=this.$store.getters["builder/getSecondaryPowerSetsFromArchetype"](e)},doPrimaryClicked:function(e){this.selectedPrimaryPowerSetIndex=e},doSecondaryClicked:function(e){this.selectedSecondaryPowerSetIndex=e},onCancelClicked:function(){this.selectedPrimaryPowerSetIndex=-1,this.selectedSecondaryPowerSetIndex=-1,this.$emit("power-set-picker-cancel","")},onSelectClicked:function(e){if(-1!==this.selectedPrimaryPowerSetIndex&&-1!==this.selectedSecondaryPowerSetIndex){var t={primary_power_set_index:this.selectedPrimaryPowerSetIndex,primary_power_set:this.primaryPowerSets[this.selectedPrimaryPowerSetIndex],secondary_power_set_index:this.selectedSecondaryPowerSetIndex,secondary_power_set:this.secondaryPowerSets[this.selectedSecondaryPowerSetIndex]};this.selectedPrimaryPowerSetIndex=-1,this.selectedSecondaryPowerSetIndex=-1,this.$emit("power-set-picker-select",t)}}}},Ee=Ne,Be=(r("e17f"),Object(h["a"])(Ee,xe,Te,!1,null,"4685d1b2",null)),Oe=Be.exports,Ie={components:{BasicInfo:m,Build:E,PowerEntryGrid:ue,PowerPicker:ke,PowerSetPicker:Oe},name:"PageToon",beforeCreate:function(){var e=this,t=this.$store.getters["builder/getToon"];null===t&&window.location.assign("/");while(I["a"].isRegistered("PageToon",O["a"].TOON_SAVE))I["a"].unregister("PageToon",O["a"].TOON_SAVE);I["a"].register("PageToon",O["a"].TOON_SAVE,(function(){e.doSave()}));while(I["a"].isRegistered("PageToon",O["a"].TOON_NOTES))I["a"].unregister("PageToon",O["a"].TOON_NOTES);I["a"].register("PageToon",O["a"].TOON_NOTES,(function(){e.doNotes()}))},data:function(){return{powerSetPickerVisible:!1,powerPickerVisible:!1,primary_power_set_display_name:"",secondary_power_set_display_name:"",availablePowerSets:[],powerLevel:0,powerEntry:null,showSpinner:!1}},computed:{getCurrentBuild:function(){var e=this.$store.getters["builder/getToonCurrentBuild"];return e},getCurrentBuildNumber:function(){var e=this.$store.getters["builder/getToonCurrentBuildNumber"];return null===e?0:e},getPowerPickerClass:function(){return this.powerPickerVisible?"":"Hidden"},getPowerSetPickerClass:function(){return this.powerSetPickerVisible?"":"Hidden"},getPrimaryPowerSetName:function(){if(""===this.primary_power_set_display_name){var e=this.$store.getters["builder/getToon"];if(e){var t=e.builds[e.current_build];if(t.power_sets.primary&&t.power_sets.secondary){var r=this.$store.getters["builder/getPowerSet"](t.power_sets.primary);return r.display_name}}return"Tap to set Primary"}return this.primary_power_set_display_name},getSecondaryPowerSetName:function(){if(""===this.secondary_power_set_display_name){var e=this.$store.getters["builder/getToon"];if(e){var t=e.builds[e.current_build];if(t.power_sets.primary&&t.power_sets.secondary){var r=this.$store.getters["builder/getPowerSet"](t.power_sets.secondary);return r.display_name}}return"Secondary"}return this.secondary_power_set_display_name},getToonArchetypeId:function(){var e=this.$store.getters["builder/getToonArchetypeId"];return null===e?"":e},getToonLevel:function(){var e=this.$store.getters["builder/getToonLevel"];return null===e?0:e},getToonName:function(){var e=this.$store.getters["builder/getToonName"];return null===e?"":e}},methods:{doBuildClicked:function(e){this.$forceUpdate()},doClick:function(e){alert(JSON.stringify(e))},doNotes:function(){this.$router.push("/Notes")},doPowerClicked:function(e){this.powerLevel=this.getPowerLevel(e),this.powerEntry=e,this.availablePowerSets=this.$store.getters["builder/getToonAllowedPowerSets"](e.level),""===this.primary_power_set_display_name?this.showPowerSetPicker():this.showPowerPicker()},doPowerPickerCancelClick:function(){this.powerPickerVisible=!1},doPowerPickerSelectClick:function(){var e=a()(i.a.mark((function e(t){var r,n;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r={level:Object(B["b"])(this.powerEntry.level),power_id:t.power.id,tag:!1,stat_include:!0,variable_value:0,slots:[],sub_powers:[]},n={buildPowerLevel:this.powerEntry.level,powerEntry:r},this.$store.commit("builder/toonSetPowerEntry",n),this.powerPickerVisible=!1;case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),doPowerSetPickerCancelClick:function(){this.powerSetPickerVisible=!1},doPowerSetPickerSelectClick:function(e){this.$store.commit("builder/toonSetPrimaryPowerSet",e.primary_power_set.id),this.$store.commit("builder/toonSetSecondaryPowerSet",e.secondary_power_set.id),this.primary_power_set_display_name=e.primary_power_set.display_name,this.secondary_power_set_display_name=e.secondary_power_set.display_name,this.powerSetPickerVisible=!1},doSave:function(){var e=this.$store.getters["builder/getToon"],t=JSON.stringify(e),r=document.createElement("a");r.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),r.setAttribute("download","MyHero.hero"),r.style.display="none",document.body.appendChild(r),r.click(),document.body.removeChild(r)},getPowerLevel:function(e){return Object(B["b"])(e.level,this.getToonArchetypeId)},showPowerSetPicker:function(){this.powerSetPickerVisible=!0},showPowerPicker:function(){this.powerPickerVisible=!0}},watch:{getCurrentBuild:function(e,t){this.$forceUpdate()},getCurrentBuildNumber:function(e,t){this.$forceUpdate()}}},$e=Ie,Re=(r("fa91"),r("eebe")),Le=r.n(Re),Ae=r("9989"),Ve=Object(h["a"])($e,n,o,!1,null,"2396b8a7",null);t["default"]=Ve.exports;Le()(Ve,"components",{QPage:Ae["a"]})},1809:function(e,t,r){"use strict";var n=r("c548"),o=r.n(n);o.a},"32d4":function(e,t,r){},"3bfd":function(e,t,r){"use strict";var n=r("88a8"),o=r.n(n);o.a},"4d89":function(e,t,r){},"50e9":function(e,t,r){},"60a0":function(e,t,r){},"694a":function(e,t,r){},"70a1":function(e,t,r){},7446:function(e,t,r){"use strict";var n=r("ffb0"),o=r.n(n);o.a},"754e":function(e,t,r){},"88a8":function(e,t,r){},"8c6f":function(e,t,r){"use strict";var n=r("a7a8"),o=r.n(n);o.a},"94dd":function(e,t,r){"use strict";var n=r("32d4"),o=r.n(n);o.a},9549:function(e,t,r){"use strict";var n=r("4d89"),o=r.n(n);o.a},a7a8:function(e,t,r){},c548:function(e,t,r){},cd5f:function(e,t,r){"use strict";var n=r("50e9"),o=r.n(n);o.a},e17f:function(e,t,r){"use strict";var n=r("60a0"),o=r.n(n);o.a},e1e5:function(e,t,r){"use strict";var n=r("70a1"),o=r.n(n);o.a},fa91:function(e,t,r){"use strict";var n=r("694a"),o=r.n(n);o.a},fcc7:function(e,t,r){"use strict";var n=r("754e"),o=r.n(n);o.a},ffb0:function(e,t,r){}}]);