/** @preserve TeDiGe-2 - Editor code, used in the editor page - https://github.com/PetitPrince/TeDiGe-2/  */


/*KeyboardJS by Robert Hurst
https://github.com/RobertWHurst/KeyboardJS*/
(function(context,factory){[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1});if(typeof define==="function"&&define.amd){define(constructAMD)}else{constructGlobal()}function constructAMD(){return init();function init(){var library;library=factory("amd");library.fork=init;return library}}function constructGlobal(){var library;library=init();library.noConflict("KeyboardJS","k");function init(){var library,namespaces=[],previousValues={};library=factory("global");library.fork=init;library.noConflict=noConflict;return library;function noConflict(){var args,nI,newNamespaces;newNamespaces=Array.prototype.slice.apply(arguments);for(nI=0;nI<namespaces.length;nI+=1){if(typeof previousValues[namespaces[nI]]==="undefined"){delete context[namespaces[nI]]}else{context[namespaces[nI]]=previousValues[namespaces[nI]]}}previousValues={};for(nI=0;nI<newNamespaces.length;nI+=1){if(typeof newNamespaces[nI]!=="string"){throw new Error("Cannot replace namespaces. All new namespaces must be strings.")}previousValues[newNamespaces[nI]]=context[newNamespaces[nI]];context[newNamespaces[nI]]=library}namespaces=newNamespaces;return namespaces}}}})(this,function(env){var KeyboardJS={},locales={},locale,map,macros,activeKeys=[],bindings=[],activeBindings=[],activeMacros=[],aI,usLocale;usLocale={map:{3:["cancel"],8:["backspace"],9:["tab"],12:["clear"],13:["enter"],16:["shift"],17:["ctrl"],18:["alt","menu"],19:["pause","break"],20:["capslock"],27:["escape","esc"],32:["space","spacebar"],33:["pageup"],34:["pagedown"],35:["end"],36:["home"],37:["left"],38:["up"],39:["right"],40:["down"],41:["select"],42:["printscreen"],43:["execute"],44:["snapshot"],45:["insert","ins"],46:["delete","del"],47:["help"],91:["command","windows","win","super","leftcommand","leftwindows","leftwin","leftsuper"],92:["command","windows","win","super","rightcommand","rightwindows","rightwin","rightsuper"],145:["scrolllock","scroll"],186:["semicolon",";"],187:["equal","equalsign","="],188:["comma",","],189:["dash","-"],190:["period","."],191:["slash","forwardslash","/"],192:["graveaccent","`"],219:["openbracket","["],220:["backslash","\\"],221:["closebracket","]"],222:["apostrophe","'"],48:["zero","0"],49:["one","1"],50:["two","2"],51:["three","3"],52:["four","4"],53:["five","5"],54:["six","6"],55:["seven","7"],56:["eight","8"],57:["nine","9"],96:["numzero","num0"],97:["numone","num1"],98:["numtwo","num2"],99:["numthree","num3"],100:["numfour","num4"],101:["numfive","num5"],102:["numsix","num6"],103:["numseven","num7"],104:["numeight","num8"],105:["numnine","num9"],106:["nummultiply","num*"],107:["numadd","num+"],108:["numenter"],109:["numsubtract","num-"],110:["numdecimal","num."],111:["numdevide","num/"],144:["numlock","num"],112:["f1"],113:["f2"],114:["f3"],115:["f4"],116:["f5"],117:["f6"],118:["f7"],119:["f8"],120:["f9"],121:["f10"],122:["f11"],123:["f12"]},macros:[["shift + `",["tilde","~"]],["shift + 1",["exclamation","exclamationpoint","!"]],["shift + 2",["at","@"]],["shift + 3",["number","#"]],["shift + 4",["dollar","dollars","dollarsign","$"]],["shift + 5",["percent","%"]],["shift + 6",["caret","^"]],["shift + 7",["ampersand","and","&"]],["shift + 8",["asterisk","*"]],["shift + 9",["openparen","("]],["shift + 0",["closeparen",")"]],["shift + -",["underscore","_"]],["shift + =",["plus","+"]],["shift + (",["opencurlybrace","opencurlybracket","{"]],["shift + )",["closecurlybrace","closecurlybracket","}"]],["shift + \\",["verticalbar","|"]],["shift + ;",["colon",":"]],["shift + '",["quotationmark",'"']],["shift + !,",["openanglebracket","<"]],["shift + .",["closeanglebracket",">"]],["shift + /",["questionmark","?"]]]};for(aI=65;aI<=90;aI+=1){usLocale.map[aI]=String.fromCharCode(aI+32);usLocale.macros.push(["shift + "+String.fromCharCode(aI+32)+", capslock + "+String.fromCharCode(aI+32),[String.fromCharCode(aI)]])}registerLocale("us",usLocale);getSetLocale("us");enable();KeyboardJS.enable=enable;KeyboardJS.disable=disable;KeyboardJS.activeKeys=getActiveKeys;KeyboardJS.on=createBinding;KeyboardJS.clear=removeBindingByKeyCombo;KeyboardJS.clear.key=removeBindingByKeyName;KeyboardJS.locale=getSetLocale;KeyboardJS.locale.register=registerLocale;KeyboardJS.macro=createMacro;KeyboardJS.macro.remove=removeMacro;KeyboardJS.key={};KeyboardJS.key.name=getKeyName;KeyboardJS.key.code=getKeyCode;KeyboardJS.combo={};KeyboardJS.combo.active=isSatisfiedCombo;KeyboardJS.combo.parse=parseKeyCombo;KeyboardJS.combo.stringify=stringifyKeyCombo;return KeyboardJS;function enable(){if(window.addEventListener){document.addEventListener("keydown",keydown,false);document.addEventListener("keyup",keyup,false);window.addEventListener("blur",reset,false);window.addEventListener("webkitfullscreenchange",reset,false);window.addEventListener("mozfullscreenchange",reset,false)}else if(window.attachEvent){document.attachEvent("onkeydown",keydown);document.attachEvent("onkeyup",keyup);window.attachEvent("onblur",reset)}}function disable(){reset();if(window.removeEventListener){document.removeEventListener("keydown",keydown,false);document.removeEventListener("keyup",keyup,false);window.removeEventListener("blur",reset,false);window.removeEventListener("webkitfullscreenchange",reset,false);window.removeEventListener("mozfullscreenchange",reset,false)}else if(window.detachEvent){document.detachEvent("onkeydown",keydown);document.detachEvent("onkeyup",keyup);window.detachEvent("onblur",reset)}}function reset(event){activeKeys=[];pruneMacros();pruneBindings(event)}function keydown(event){var keyNames,keyName,kI;keyNames=getKeyName(event.keyCode);if(keyNames.length<1){return}event.isRepeat=false;for(kI=0;kI<keyNames.length;kI+=1){keyName=keyNames[kI];if(getActiveKeys().indexOf(keyName)!=-1)event.isRepeat=true;addActiveKey(keyName)}executeMacros();executeBindings(event)}function keyup(event){var keyNames,kI;keyNames=getKeyName(event.keyCode);if(keyNames.length<1){return}for(kI=0;kI<keyNames.length;kI+=1){removeActiveKey(keyNames[kI])}pruneMacros();pruneBindings(event)}function getKeyName(keyCode){return map[keyCode]||[]}function getKeyCode(keyName){var keyCode;for(keyCode in map){if(!map.hasOwnProperty(keyCode)){continue}if(map[keyCode].indexOf(keyName)>-1){return keyCode}}return false}function createMacro(combo,injectedKeys){if(typeof combo!=="string"&&(typeof combo!=="object"||typeof combo.push!=="function")){throw new Error("Cannot create macro. The combo must be a string or array.")}if(typeof injectedKeys!=="object"||typeof injectedKeys.push!=="function"){throw new Error("Cannot create macro. The injectedKeys must be an array.")}macros.push([combo,injectedKeys])}function removeMacro(combo){var macro;if(typeof combo!=="string"&&(typeof combo!=="object"||typeof combo.push!=="function")){throw new Error("Cannot remove macro. The combo must be a string or array.")}for(mI=0;mI<macros.length;mI+=1){macro=macros[mI];if(compareCombos(combo,macro[0])){removeActiveKey(macro[1]);macros.splice(mI,1);break}}}function executeMacros(){var mI,combo,kI;for(mI=0;mI<macros.length;mI+=1){combo=parseKeyCombo(macros[mI][0]);if(activeMacros.indexOf(macros[mI])===-1&&isSatisfiedCombo(combo)){activeMacros.push(macros[mI]);for(kI=0;kI<macros[mI][1].length;kI+=1){addActiveKey(macros[mI][1][kI])}}}}function pruneMacros(){var mI,combo,kI;for(mI=0;mI<activeMacros.length;mI+=1){combo=parseKeyCombo(activeMacros[mI][0]);if(isSatisfiedCombo(combo)===false){for(kI=0;kI<activeMacros[mI][1].length;kI+=1){removeActiveKey(activeMacros[mI][1][kI])}activeMacros.splice(mI,1);mI-=1}}}function createBinding(keyCombo,keyDownCallback,keyUpCallback){var api={},binding,subBindings=[],bindingApi={},kI,subCombo;if(typeof keyCombo==="string"){keyCombo=parseKeyCombo(keyCombo)}for(kI=0;kI<keyCombo.length;kI+=1){binding={};subCombo=stringifyKeyCombo([keyCombo[kI]]);if(typeof subCombo!=="string"){throw new Error("Failed to bind key combo. The key combo must be string.")}binding.keyCombo=subCombo;binding.keyDownCallback=[];binding.keyUpCallback=[];if(keyDownCallback){binding.keyDownCallback.push(keyDownCallback)}if(keyUpCallback){binding.keyUpCallback.push(keyUpCallback)}bindings.push(binding);subBindings.push(binding)}api.clear=clear;api.on=on;return api;function clear(){var bI;for(bI=0;bI<subBindings.length;bI+=1){bindings.splice(bindings.indexOf(subBindings[bI]),1)}}function on(eventName){var api={},callbacks,cI,bI;if(typeof eventName!=="string"){throw new Error("Cannot bind callback. The event name must be a string.")}if(eventName!=="keyup"&&eventName!=="keydown"){throw new Error('Cannot bind callback. The event name must be a "keyup" or "keydown".')}callbacks=Array.prototype.slice.apply(arguments,[1]);for(cI=0;cI<callbacks.length;cI+=1){if(typeof callbacks[cI]==="function"){if(eventName==="keyup"){for(bI=0;bI<subBindings.length;bI+=1){subBindings[bI].keyUpCallback.push(callbacks[cI])}}else if(eventName==="keydown"){for(bI=0;bI<subBindings.length;bI+=1){subBindings[bI].keyDownCallback.push(callbacks[cI])}}}}api.clear=clear;return api;function clear(){var cI,bI;for(cI=0;cI<callbacks.length;cI+=1){if(typeof callbacks[cI]==="function"){if(eventName==="keyup"){for(bI=0;bI<subBindings.length;bI+=1){subBindings[bI].keyUpCallback.splice(subBindings[bI].keyUpCallback.indexOf(callbacks[cI]),1)}}else{for(bI=0;bI<subBindings.length;bI+=1){subBindings[bI].keyDownCallback.splice(subBindings[bI].keyDownCallback.indexOf(callbacks[cI]),1)}}}}}}}function removeBindingByKeyCombo(keyCombo){var bI,binding,keyName;for(bI=0;bI<bindings.length;bI+=1){binding=bindings[bI];if(compareCombos(keyCombo,binding.keyCombo)){bindings.splice(bI,1);bI-=1}}}function removeBindingByKeyName(keyName){var bI,kI,binding;if(keyName){for(bI=0;bI<bindings.length;bI+=1){binding=bindings[bI];for(kI=0;kI<binding.keyCombo.length;kI+=1){if(binding.keyCombo[kI].indexOf(keyName)>-1){bindings.splice(bI,1);bI-=1;break}}}}else{bindings=[]}}function executeBindings(event){var bI,sBI,binding,bindingKeys,remainingKeys,cI,killEventBubble,kI,bindingKeysSatisfied,index,sortedBindings=[],bindingWeight;remainingKeys=[].concat(activeKeys);for(bI=0;bI<bindings.length;bI+=1){bindingWeight=extractComboKeys(bindings[bI].keyCombo).length;if(!sortedBindings[bindingWeight]){sortedBindings[bindingWeight]=[]}sortedBindings[bindingWeight].push(bindings[bI])}for(sBI=sortedBindings.length-1;sBI>=0;sBI-=1){if(!sortedBindings[sBI]){continue}for(bI=0;bI<sortedBindings[sBI].length;bI+=1){binding=sortedBindings[sBI][bI];bindingKeys=extractComboKeys(binding.keyCombo);bindingKeysSatisfied=true;for(kI=0;kI<bindingKeys.length;kI+=1){if(remainingKeys.indexOf(bindingKeys[kI])===-1){bindingKeysSatisfied=false;break}}if(bindingKeysSatisfied&&isSatisfiedCombo(binding.keyCombo)){activeBindings.push(binding);for(kI=0;kI<bindingKeys.length;kI+=1){index=remainingKeys.indexOf(bindingKeys[kI]);if(index>-1){remainingKeys.splice(index,1);kI-=1}}for(cI=0;cI<binding.keyDownCallback.length;cI+=1){if(binding.keyDownCallback[cI](event,getActiveKeys(),binding.keyCombo)===false){killEventBubble=true}}if(killEventBubble===true){event.preventDefault();event.stopPropagation()}}}}}function pruneBindings(event){var bI,cI,binding,killEventBubble;for(bI=0;bI<activeBindings.length;bI+=1){binding=activeBindings[bI];if(isSatisfiedCombo(binding.keyCombo)===false){for(cI=0;cI<binding.keyUpCallback.length;cI+=1){if(binding.keyUpCallback[cI](event,getActiveKeys(),binding.keyCombo)===false){killEventBubble=true}}if(killEventBubble===true){event.preventDefault();event.stopPropagation()}activeBindings.splice(bI,1);bI-=1}}}function compareCombos(keyComboArrayA,keyComboArrayB){var cI,sI,kI;keyComboArrayA=parseKeyCombo(keyComboArrayA);keyComboArrayB=parseKeyCombo(keyComboArrayB);if(keyComboArrayA.length!==keyComboArrayB.length){return false}for(cI=0;cI<keyComboArrayA.length;cI+=1){if(keyComboArrayA[cI].length!==keyComboArrayB[cI].length){return false}for(sI=0;sI<keyComboArrayA[cI].length;sI+=1){if(keyComboArrayA[cI][sI].length!==keyComboArrayB[cI][sI].length){return false}for(kI=0;kI<keyComboArrayA[cI][sI].length;kI+=1){if(keyComboArrayB[cI][sI].indexOf(keyComboArrayA[cI][sI][kI])===-1){return false}}}}return true}function isSatisfiedCombo(keyCombo){var cI,sI,stage,kI,stageOffset=0,index,comboMatches;keyCombo=parseKeyCombo(keyCombo);for(cI=0;cI<keyCombo.length;cI+=1){comboMatches=true;stageOffset=0;for(sI=0;sI<keyCombo[cI].length;sI+=1){stage=[].concat(keyCombo[cI][sI]);for(kI=stageOffset;kI<activeKeys.length;kI+=1){index=stage.indexOf(activeKeys[kI]);if(index>-1){stage.splice(index,1);stageOffset=kI}}if(stage.length!==0){comboMatches=false;break}}if(comboMatches){return true}}return false}function extractComboKeys(keyCombo){var cI,sI,kI,keys=[];keyCombo=parseKeyCombo(keyCombo);for(cI=0;cI<keyCombo.length;cI+=1){for(sI=0;sI<keyCombo[cI].length;sI+=1){keys=keys.concat(keyCombo[cI][sI])}}return keys}function parseKeyCombo(keyCombo){var s=keyCombo,i=0,op=0,ws=false,nc=false,combos=[],combo=[],stage=[],key="";if(typeof keyCombo==="object"&&typeof keyCombo.push==="function"){return keyCombo}if(typeof keyCombo!=="string"){throw new Error('Cannot parse "keyCombo" because its type is "'+typeof keyCombo+'". It must be a "string".')}while(s.charAt(i)===" "){i+=1}while(true){if(s.charAt(i)===" "){while(s.charAt(i)===" "){i+=1}ws=true}else if(s.charAt(i)===","){if(op||nc){throw new Error("Failed to parse key combo. Unexpected , at character index "+i+".")}nc=true;i+=1}else if(s.charAt(i)==="+"){if(key.length){stage.push(key);key=""}if(op||nc){throw new Error("Failed to parse key combo. Unexpected + at character index "+i+".")}op=true;i+=1}else if(s.charAt(i)===">"){if(key.length){stage.push(key);key=""}if(stage.length){combo.push(stage);stage=[]}if(op||nc){throw new Error("Failed to parse key combo. Unexpected > at character index "+i+".")}op=true;i+=1}else if(i<s.length-1&&s.charAt(i)==="!"&&(s.charAt(i+1)===">"||s.charAt(i+1)===","||s.charAt(i+1)==="+")){key+=s.charAt(i+1);op=false;ws=false;nc=false;i+=2}else if(i<s.length&&s.charAt(i)!=="+"&&s.charAt(i)!==">"&&s.charAt(i)!==","&&s.charAt(i)!==" "){if(op===false&&ws===true||nc===true){if(key.length){stage.push(key);key=""}if(stage.length){combo.push(stage);stage=[]}if(combo.length){combos.push(combo);combo=[]}}op=false;ws=false;nc=false;while(i<s.length&&s.charAt(i)!=="+"&&s.charAt(i)!==">"&&s.charAt(i)!==","&&s.charAt(i)!==" "){key+=s.charAt(i);i+=1}}else{i+=1;continue}if(i>=s.length){if(key.length){stage.push(key);key=""}if(stage.length){combo.push(stage);stage=[]}if(combo.length){combos.push(combo);combo=[]}break}}return combos}function stringifyKeyCombo(keyComboArray){var cI,ccI,output=[];if(typeof keyComboArray==="string"){return keyComboArray}if(typeof keyComboArray!=="object"||typeof keyComboArray.push!=="function"){throw new Error("Cannot stringify key combo.")}for(cI=0;cI<keyComboArray.length;cI+=1){output[cI]=[];for(ccI=0;ccI<keyComboArray[cI].length;ccI+=1){output[cI][ccI]=keyComboArray[cI][ccI].join(" + ")}output[cI]=output[cI].join(" > ")}return output.join(" ")}function getActiveKeys(){return[].concat(activeKeys)}function addActiveKey(keyName){if(keyName.match(/\s/)){throw new Error("Cannot add key name "+keyName+" to active keys because it contains whitespace.")}if(activeKeys.indexOf(keyName)>-1){return}activeKeys.push(keyName)}function removeActiveKey(keyName){var keyCode=getKeyCode(keyName);if(keyCode==="91"||keyCode==="92"){activeKeys=[]}else{activeKeys.splice(activeKeys.indexOf(keyName),1)}}function registerLocale(localeName,localeMap){if(typeof localeName!=="string"){throw new Error("Cannot register new locale. The locale name must be a string.")}if(typeof localeMap!=="object"){throw new Error("Cannot register "+localeName+" locale. The locale map must be an object.")}if(typeof localeMap.map!=="object"){throw new Error("Cannot register "+localeName+" locale. The locale map is invalid.")}if(!localeMap.macros){localeMap.macros=[]}locales[localeName]=localeMap}function getSetLocale(localeName){if(localeName){if(typeof localeName!=="string"){throw new Error("Cannot set locale. The locale name must be a string.")}if(!locales[localeName]){throw new Error("Cannot set locale to "+localeName+" because it does not exist. If you would like to submit a "+localeName+" locale map for KeyboardJS please submit it at https://github.com/RobertWHurst/KeyboardJS/issues.")}map=locales[localeName].map;macros=locales[localeName].macros;locale=localeName}return locale}});


/* --- Palette related code --- */

/** Draw a single palette decoration

	@function
	@param {string} kind Define the color of the block to be drawn. Possible values: (SZLJTOIG)
	@param {number} blockSize Size of a typical block
	@param sprite Sprite object
*/
function drawPaletteDecoCell(kind,blockSize,sprite){
	var Canvas = $('#editor-palette-deco-'+kind);
	var ctx = Canvas[0].getContext('2d');

	var spriteOffsetStart, spriteOffsetEnd;
	switch(kind){
		case 'n1':	spriteOffsetStart = decoration.n1.s; spriteOffsetEnd = decoration.n1.e; break;
		case 'n2':	spriteOffsetStart = decoration.n2.s; spriteOffsetEnd = decoration.n2.e; break;
		case 'n3':	spriteOffsetStart = decoration.n3.s; spriteOffsetEnd = decoration.n3.e; break;
		case 'n4':	spriteOffsetStart = decoration.n4.s; spriteOffsetEnd = decoration.n4.e; break;
		case 'n5':	spriteOffsetStart = decoration.n5.s; spriteOffsetEnd = decoration.n5.e; break;
		case 'n6':	spriteOffsetStart = decoration.n6.s; spriteOffsetEnd = decoration.n6.e; break;
		case 'n7':	spriteOffsetStart = decoration.n7.s; spriteOffsetEnd = decoration.n7.e; break;
		case 'n8':	spriteOffsetStart = decoration.n8.s; spriteOffsetEnd = decoration.n8.e; break;
		case 'n9':	spriteOffsetStart = decoration.n9.s; spriteOffsetEnd = decoration.n9.e; break;
		case 'n0':	spriteOffsetStart = decoration.n0.s; spriteOffsetEnd = decoration.n0.e; break;
		case 'smallcw':	spriteOffsetStart = decoration.smallcw.s; spriteOffsetEnd = decoration.smallcw.e; break;
		case 'smallccw':	spriteOffsetStart = decoration.smallccw.s; spriteOffsetEnd = decoration.smallccw.e; break;
		case 'smalloktick':	spriteOffsetStart = decoration.smalloktick.s; spriteOffsetEnd = decoration.smalloktick.e; break;
		case 'smallokcircle':	spriteOffsetStart = decoration.smallokcircle.s; spriteOffsetEnd = decoration.smallokcircle.e; break;
		case 'smallnocross':	spriteOffsetStart = decoration.smallnocross.s; spriteOffsetEnd = decoration.smallnocross.e; break;
		case 'smallquestion':	spriteOffsetStart = decoration.smallquestion.s; spriteOffsetEnd = decoration.smallquestion.e; break;
		case 'smallexclamation':	spriteOffsetStart = decoration.smallexclamation.s; spriteOffsetEnd = decoration.smallexclamation.e; break;
		case 'nwarrow':	spriteOffsetStart = decoration.nwarrow.s; spriteOffsetEnd = decoration.nwarrow.e; break;
		case 'narrow':	spriteOffsetStart = decoration.narrow.s; spriteOffsetEnd = decoration.narrow.e; break;
		case 'nearrow':	spriteOffsetStart = decoration.nearrow.s; spriteOffsetEnd = decoration.nearrow.e; break;
		case 'earrow':	spriteOffsetStart = decoration.earrow.s; spriteOffsetEnd = decoration.earrow.e; break;
		case 'searrow':	spriteOffsetStart = decoration.searrow.s; spriteOffsetEnd = decoration.searrow.e; break;
		case 'sarrow':	spriteOffsetStart = decoration.sarrow.s; spriteOffsetEnd = decoration.sarrow.e; break;
		case 'swarrow':	spriteOffsetStart = decoration.swarrow.s; spriteOffsetEnd = decoration.swarrow.e; break;
		case 'warrow':	spriteOffsetStart = decoration.warrow.s; spriteOffsetEnd = decoration.warrow.e; break;
		case 'bigcw':	spriteOffsetStart = decoration.bigcw.s; spriteOffsetEnd = decoration.bigcw.e; break;
		case 'bigccw':	spriteOffsetStart = decoration.bigccw.s; spriteOffsetEnd = decoration.bigccw.e; break;
		case 'bigquestion':	spriteOffsetStart = decoration.bigquestion.s; spriteOffsetEnd = decoration.bigquestion.e; break;
		case 'bigexclamation':	spriteOffsetStart = decoration.bigexclamation.s; spriteOffsetEnd = decoration.bigexclamation.e; break;
		case 'bigoktick':	spriteOffsetStart = decoration.bigoktick.s; spriteOffsetEnd = decoration.bigoktick.e; break;
		case 'bigokcircle':	spriteOffsetStart = decoration.bigokcircle.s; spriteOffsetEnd = decoration.bigokcircle.e; break;
		case 'bignocross':	spriteOffsetStart = decoration.bignocross.s; spriteOffsetEnd = decoration.bignocross.e; break;
		case 'overlayyellow':	spriteOffsetStart = decoration.overlayyellow.s; spriteOffsetEnd = decoration.overlayyellow.e; break;
		case 'overlayblue':	spriteOffsetStart = decoration.overlayblue.s; spriteOffsetEnd = decoration.overlayblue.e; break;
		case 'overlaygreen':	spriteOffsetStart = decoration.overlaygreen.s; spriteOffsetEnd = decoration.overlaygreen.e; break;
		case 'overlaypink':	spriteOffsetStart = decoration.overlaypink.s; spriteOffsetEnd = decoration.overlaypink.e; break;
		case 'overlayorange':	spriteOffsetStart = decoration.overlayorange.s; spriteOffsetEnd = decoration.overlayorange.e; break;
		case 'clear1':	spriteOffsetStart = decoration.clear1.s; spriteOffsetEnd = decoration.clear1.e; break;
		case 'clear2':	spriteOffsetStart = decoration.clear2.s; spriteOffsetEnd = decoration.clear2.e; break;
		case 'clear3':	spriteOffsetStart = decoration.clear3.s; spriteOffsetEnd = decoration.clear3.e; break;
		case 'clear4':	spriteOffsetStart = decoration.clear4.s; spriteOffsetEnd = decoration.clear4.e; break;
		case 'clear5':	spriteOffsetStart = decoration.clear5.s; spriteOffsetEnd = decoration.clear5.e; break;
		case 'clear6':	spriteOffsetStart = decoration.clear6.s; spriteOffsetEnd = decoration.clear6.e; break;
		case 'clear7':	spriteOffsetStart = decoration.clear7.s; spriteOffsetEnd = decoration.clear7.e; break;
		}

	var ox = spriteOffsetStart[0]*(blockSize);
	var oy = spriteOffsetStart[1]*(blockSize);
	var w = (spriteOffsetEnd[0]-spriteOffsetStart[0])*(blockSize);

	var h = (spriteOffsetEnd[1]-spriteOffsetStart[1])*(blockSize);
	var nx = 0;
	var ny = 0;

	ctx.drawImage(sprite, // original image
				  ox,oy, //coordinate on the original image
				  w,h, // size of the rectangle to will be cut
				  nx,ny, // destination coordinate
				  w,h); // destination size
}

/** Draw a single palette piece

	@function
	@param {string} type Piece type. Possible value: SZLJTOIG
	@param {string} orientation Piece orientation. Possible value:  i cw ccw u
	@param {string} RS Define the style of the block. Possible value: 'ARS, 'SRS','GB'
	@param {number} blockSize Size of a typical block
	@param sprite Sprite object
*/
function drawPaletteCell(type,orientation,RS,blockSize,sprite){
	var Canvas = $('#editor-palette-'+type+orientation);
	var ctx = Canvas[0].getContext('2d');
	var matrix = getMatrix(type, orientation, RS);
	Canvas.attr('width',Canvas.width());
	var color,spriteOffset;
	switch(RS){
		case 'ARS':
			switch(type){
				case 'I':
					color = ARS.I.color;
					spriteOffset = ARS.I.offset;
					break;
				case 'T':
					color = ARS.T.color;
					spriteOffset = ARS.T.offset;
					break;
				case 'L':
					color = ARS.L.color;
					spriteOffset = ARS.L.offset;
					break;
				case 'J':
					color = ARS.J.color;
					spriteOffset = ARS.J.offset;
					break;
				case 'S':
					color = ARS.S.color;
					spriteOffset = ARS.S.offset;
					break;
				case 'Z':
					color = ARS.Z.color;
					spriteOffset = ARS.Z.offset;
					break;
				case 'O':
					color = ARS.O.color;
					spriteOffset = ARS.O.offset;
					break;
				case 'G':
					color = ARS.G.color;
					spriteOffset = ARS.G.offset;
					break;
			}
		break;
		case 'SRS':
			switch(type){
				case 'I':
					color = SRS.I.color;
					spriteOffset = SRS.I.offset;
					break;
				case 'T':
					color = SRS.T.color;
					spriteOffset = SRS.T.offset;
					break;
				case 'L':
					color = SRS.L.color;
					spriteOffset = SRS.L.offset;
					break;
				case 'J':
					color = SRS.J.color;
					spriteOffset = SRS.J.offset;
					break;
				case 'S':
					color = SRS.S.color;
					spriteOffset = SRS.S.offset;
					break;
				case 'Z':
					color = SRS.Z.color;
					spriteOffset = SRS.Z.offset;
					break;
				case 'O':
					color = SRS.O.color;
					spriteOffset = SRS.O.offset;
					break;
				case 'G':
					color = SRS.G.color;
					spriteOffset = SRS.G.offset;
					break;
			}
		break;
		case 'GB':
			switch(type){
				case 'I':
					color = GB.I.color;
					spriteOffset = GB.I.offset;
					break;
				case 'T':
					color = GB.T.color;
					spriteOffset = GB.T.offset;
					break;
				case 'L':
					color = GB.L.color;
					spriteOffset = GB.L.offset;
					break;
				case 'J':
					color = GB.J.color;
					spriteOffset = GB.J.offset;
					break;
				case 'S':
					color = GB.S.color;
					spriteOffset = GB.S.offset;
					break;
				case 'Z':
					color = GB.Z.color;
					spriteOffset = GB.Z.offset;
					break;
				case 'O':
					color = GB.O.color;
					spriteOffset = GB.O.offset;
					break;
				case 'G':
					color = GB.G.color;
					spriteOffset = GB.G.offset;
					break;
			}
		break;
		}

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (matrix[i][j]) {
				ctx.beginPath();
				ctx.rect(parseInt(j*blockSize,10),parseInt(i*blockSize,10),blockSize,blockSize);
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();
				if (sprite) {
					ctx.drawImage(sprite, // original image
								  spriteOffset[0]*blockSize,spriteOffset[1]*blockSize, //coordinate on the original image
								  blockSize,blockSize, // size of the rectangle to will be cut
								  parseInt(j*blockSize,10),parseInt(i*blockSize,10), // destination coordinate
								  blockSize,blockSize); // destination size
				}

			}
		}
	}

}//end drawpalettecell

/** Draw the entire tetramino palette

	@function
	@param {string} RS Define the style of the block. Possible value: 'ARS, 'SRS'
	@param {number} blockSize Size of a typical block
	@param sprite Sprite object
*/
function drawPalette(RS, blockSize,sprite){
	var type = ['I','T','S','Z','L','J','O'];
	var orientation = ['i','cw','ccw','u'];

	for (var i = 0; i < type.length; i++) {
		for (var j = 0; j < orientation.length; j++) {
			drawPaletteCell(type[i],orientation[j],RS,blockSize,sprite);
		}
	}
}

/** Draw the entire decoration palette

	@function
	@param {number} blockSize Size of a typical block
	@param sprite Sprite object
*/
function drawPaletteDeco(blockSize,sprite){
	var type = ['n1','n2','n3','n4','n5','n6','n7','n8','n9','n0','smallccw','smallcw','smalloktick','smallokcircle','smallnocross','smallquestion','smallexclamation','nwarrow','narrow','nearrow','earrow','searrow','sarrow','swarrow','warrow','bigcw','bigccw','smallquestion','bigquestion','bigexclamation','bigoktick','bigokcircle','bignocross','overlayyellow','overlayblue','overlaygreen','overlaypink','overlaypink','clear1','clear2','clear3','clear4','clear5','clear6','clear7'];

	for (var i = 0; i < type.length; i++) {
			drawPaletteDecoCell(type[i],blockSize,sprite);
	}
}

/* === Class Extension --- */

/* --- Painter ---*/

/** Get the jQuery object of the export canvas.*/
Painter.prototype.CanvasExport;
/** Get the 2d context of the related canvas*/
Painter.prototype.ContextExport;

/** Export the current frame into a png image.
	@param {number} mode Expects "play" or something else. If play is passed, a huge "play" sign is drawn on the image.
*/
Painter.prototype.exportImage = function(mode){
	this.ContextExport.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
	this.CanvasExport.attr('width',this.CanvasExport.width());
	var buffer = document.createElement('canvas');
	buffer.width = this.CanvasWidth;
	buffer.height = this.CanvasHeight+this.CanvasControl.height();

	this.ContextExport.drawImage(this.CanvasNextHold[0],0,0); // draw nexthold

	if (mode !='gif') //legacy "if" when the gif quantizer was fubar
	{
		this.ContextExport.drawImage(this.CanvasBorder[0],0,32);
		this.ContextExport.drawImage(this.CanvasBackground[0],0,32);
	}
	var imgData_PF = this.ContextPF.getImageData(0,0,this.CanvasWidth,this.CanvasHeight);
	var tmp = 0;
	for(var i=0, istop = imgData_PF.data.length ; i<istop ; i+=4) // loop to get inactive layer darker/less opaque
	{
		imgData_PF.data[i+3]=parseInt(255*0.65,10); // get 0.65 opacity,
		tmp = imgData_PF.data[i] + imgData_PF.data[i+1] + imgData_PF.data[i+2];

		if(!tmp)
		{
			imgData_PF.data[i+3]= 0; // if black pixel -> transparent
		}
		tmp = 0;

	}
	buffer.getContext('2d').putImageData(imgData_PF,0,0);
	this.ContextExport.drawImage(buffer,0,32);
	this.ContextExport.drawImage(this.CanvasActive[0],0,32);
	this.ContextExport.drawImage(this.CanvasWhiteborder[0],0,32);
	this.ContextExport.drawImage(this.CanvasDeco[0],0,32);
	this.ContextExport.drawImage(this.CanvasControl[0],0,this.CanvasHeight+32);

	if(mode == 'play') // draw a huge "play" sign
	{
		this.ContextExport.beginPath();
		this.ContextExport.moveTo(32,60);
		this.ContextExport.lineTo(75,84);
		this.ContextExport.lineTo(32,110);
		this.ContextExport.fillStyle = "rgba(255,255,255,0.66)";
		this.ContextExport.closePath();
		this.ContextExport.fill();
	}	
};

/* --- Here is where I dabble with the thumbnails stuff ---*/

/** Append a thumbnail at the designated position (starts at 1)
	@param {number} id Unique id of the thumbnail
	@param {number} position Where in the timeline the thumbnail should be inserted. Start at 1.
*/
Painter.prototype.appendThumbnail = function(id,position) {
	/*

	.thumbnail-container{
		width: 40px;
		height: 80px;
	}
	.thumbnail-container canvas{
	position: absolute;
	left:0;
	top:0;
	}
	*/
	var output = '<div id="thumbnail-'+id+'" class="thumbnail"> <canvas class="active" id="thumbnail-'+id+'-active" height="80" width="40"></canvas><canvas class="inactive" id="thumbnail-'+id+'-inactive" height="80" width="40"></canvas><canvas class="deco" id="thumbnail-'+id+'-deco" height="80" width="40"></canvas></div>';
	// height and size definition are necessary
	$('#thumbnails > .thumbnail:nth-child('+position+')').after(output);	
};

/** Erase a layer in the thumbnail
	@param {number} id Unique id of the thumbnail
	@param {number} mode Expect "inactive", "active" or "deco"
*/

Painter.prototype.clearThumbnail = function(id,mode) {
	var canvas;
	switch(mode){
		case 'inactive':
			canvas = $('#thumbnail-' + id +'-inactive');
		break;
		case 'active':
			canvas = $('#thumbnail-' + id +'-active');
		break;
		case 'deco':
			canvas = $('#thumbnail-' + id +'-deco');
		break;
	}	
	var ctx = canvas[0].getContext('2d');
	ctx.clearRect(0,0,canvas[0].width,canvas[0].height);
}

/*Those are 3 objects that serves as cache for the jquery object while messing with thumbnails http://stackoverflow.com/questions/8002181/jquery-global-selection-cache*/
var thumbnail_registry_inactive = {};
var thumbnail_registry_active = {};
var thumbnail_registry_demo = {};

/** Modify the related thumbnail in the same way frame.modify does
		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Piece type. Possible value: SZLJTOIG and E (empty)
		@param {string} id Unique id of the frame
		@param {string} mode Define which layer to modify. Possible value: inactive, active, deco
*/
Painter.prototype.modifyThumbnail = function(x,y,type,id,mode) {

	if (mode == "inactive") {
		//console.log(10);
		if (thumbnail_registry_inactive[id]) 
			{
		//console.log(11);
				var canvas = thumbnail_registry_inactive[id];
			}
		else
			{
		//console.log(12);
		//console.log(id);
				thumbnail_registry_inactive[id] = $('#thumbnail-' + id +'-inactive');
				var canvas = thumbnail_registry_inactive[id];
				//console.log(canvas);
			}
	};
	if (mode == "active") {

		if (thumbnail_registry_active[id]) 
		{
		//console.log(21);
			var canvas = thumbnail_registry_active[id];
		}
		else
		{
		//console.log(22);
			thumbnail_registry_active[id] = $('#thumbnail-' + id +'-active');
			var canvas = thumbnail_registry_active[id];
		}
	};
	var ctx = canvas[0].getContext('2d'),
		color,
		blockSize = 4;
		switch(type){
				case 'I':
					color = ARS.I.color;
					break;
				case 'T':
					color = ARS.T.color;
					break;
				case 'L':
					color = ARS.L.color;
					break;
				case 'J':
					color = ARS.J.color;
					break;
				case 'S':
					color = ARS.S.color;
					break;
				case 'Z':
					color = ARS.Z.color;
					break;
				case 'O':
					color = ARS.O.color;
					break;
				case 'G':
					color = ARS.G.color;
					break;
		}
		if (type == 'E') {
			ctx.clearRect(x*blockSize,y*blockSize,blockSize,blockSize); // blockSize == blockSize

		}else{
			if (mode == "inactive") {
				ctx.beginPath();
				ctx.rect(x*blockSize,y*blockSize,blockSize,blockSize); // blockSize == blockSize
				ctx.fillStyle = color;			
				ctx.fill();
				ctx.closePath();
			}
			if (mode =="active"){
				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.lineWidth = 1;			
				ctx.strokeRect(x*blockSize,y*blockSize,blockSize,blockSize); // blockSize == blockSize
				ctx.closePath();
			}
		};
			// ctx.fillStyle = "rgb("+
			// Math.floor(Math.random()*256)+","+
			// Math.floor(Math.random()*256)+","+
			// Math.floor(Math.random()*256)+")";
 }

// dirty function extension: http://stackoverflow.com/questions/4578424/javascript-extend-a-function/4578464
var old_frame_modify = Frame.prototype.modify;

Frame.prototype.modify = function(x,y,type){
	old_frame_modify.apply(this,arguments);
	this.painter.modifyThumbnail(x,y,type,this.id,"inactive");
};	
/*
var old_painter_drawblock = Painter.prototype.drawBlock;

Painter.prototype.drawBlock = function(x,y,type,RS,context,highlight){
	old_painter_drawblock.apply(this,arguments);
	if (context == "inactive" || context == "garbage") {
			this.modifyThumbnail(x,y,type,this.id,"inactive");
	}
	if (context == "active"){
		this.modifyThumbnail(x,y,type,this.id,"active");
	}
};*/

var old_frame_addPiece = Frame.prototype.addPiece;
Frame.prototype.addPiece = function(x,y,type,orientation,mode,drop){
	old_frame_addPiece.apply(this,arguments);
	var matrix = getMatrix(type, orientation, this.RS);
	if (mode == "active") {
		this.painter.clearThumbnail(this.id,'active');
	};
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(matrix[i][j])
			{
				if (mode == "inactive" || mode == "garbage") {
					//this.painter.modifyThumbnail(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.id,"inactive");
				};

				if (mode == "active") {
					this.painter.modifyThumbnail(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.id,'active');
				};
			};
		}
	}

}

	Frame.prototype.loadActiveHook = function(x,y,type,orientation){	
	this.painter.clearThumbnail(this.id,'active');
	
	if (type != "E") {
		var matrix = getMatrix(type, orientation, this.RS);
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(matrix[i][j])
				{
					this.painter.modifyThumbnail(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.id,'active');
				};
			}
		}

	};		
	}


var old_diagram_new_frame = Diagram.prototype.new_frame;

Diagram.prototype.new_frame = function(){
	old_diagram_new_frame.apply(this,arguments);
	this.painter.appendThumbnail(this.frames[this.current_frame].id,this.current_frame)
};

var old_diagram_remove_current_frame = Diagram.prototype.remove_current_frame;

Diagram.prototype.remove_current_frame = function(){
	if (this.frames.length == 1) {
		$('#thumbnail-'+this.frames[0].id).toggleClass('selected');
	};
	this.painter.deleteThumbnail(this.current_frame);
	old_diagram_remove_current_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
};


var old_diagram_remove_following_frames = Diagram.prototype.remove_following_frames;

Diagram.prototype.remove_following_frames = function(){
	for (var i = this.frames.length ; i >= this.current_frame+1 ; i--) {
			this.painter.deleteThumbnail(i);
	};
	old_diagram_remove_following_frames.apply(this);
};

/** Append a thumbnail at the designated position (starts at 1)
*/
Painter.prototype.deleteThumbnail = function(position) {
	if ($('#thumbnails > .thumbnail').size() == 1) {
		this.clearThumbnail(1,'active');
		this.clearThumbnail(1,'inactive');		
		//$('#thumbnails > canvas')[0].getContext('2d').clearRect(0,0,$('#thumbnails canvas')[0].width,$('#thumbnails canvas')[0].height);
	}else{
	$('#thumbnails > .thumbnail:nth-child('+parseInt(position+1)+')').remove();	

	}

};

var old_diagram_first_frame = Diagram.prototype.first_frame;

Diagram.prototype.first_frame = function(){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_first_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
};

var old_diagram_previous_frame = Diagram.prototype.previous_frame;

// todo 02.11.13: next & previous highlight are broken
Diagram.prototype.previous_frame = function(){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_previous_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
};

var old_diagram_next_frame = Diagram.prototype.next_frame;

Diagram.prototype.next_frame = function(){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_next_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
};

var old_diagram_last_frame = Diagram.prototype.last_frame;

Diagram.prototype.last_frame = function(){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_last_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
};

var old_diagram_new_copy_frame = Diagram.prototype.new_copy_frame;
Diagram.prototype.new_copy_frame = function(){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_new_copy_frame.apply(this);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
}

var old_diagram_goto_frame = Diagram.prototype.goto_frame;
Diagram.prototype.goto_frame = function(frame_number){
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	old_diagram_goto_frame.apply(this,arguments);
	$('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).toggleClass('selected');
	$('#thumbnails-container').scrollLeft(0); // scrollLeft give a coordinate
	$('#thumbnails-container').scrollLeft($('#thumbnail-'+parseInt(this.frames[this.current_frame].id)).position().left-180);
}

Diagram.prototype.remove_frame = function(frame_number){ // todo: is this working ?
	if (frame_number == this.current_frame) {
		this.remove_current_frame();
	}

	else if(this.frames.length > 1 )
		{
			this.frames.splice(frame_number+1,1);
		}
	else{
			this.current_frame = 0;
			this.frames[this.current_frame].clear('all');
	};

}

/* --- End thumbnails ---*/


/* ------------------------------------------- */
/* -- Frame:: Frames-wide properties change -- */
/* ------------------------------------------- */

/** Changes the border style of the diagram.

	@param {string} kind Desired border type. Currently supported:
		'master' (gray-bluish), 'easy' (green) and 'death' (red). Defaults to master if
		none is selected
*/
Diagram.prototype.modify_border = function(kind){
	for(var i=0, istop = this.frames.length ; i<istop ;i++)
	{
		this.frames[i].border = kind;
	}
	this.frames[this.current_frame].modify_border(kind);
};

/** Change the rotation system for the whole diagram

	@param {string} system Desired rotation system. Possible value: 'ARS', 'SRS'
*/
Diagram.prototype.modify_RS = function(system){
	for(var i=0, istop = this.frames.length ; i<istop ;i++)
	{
		this.frames[i].RS = system;
	}
	this.frames[this.current_frame].modify_RS(system);
};

/** Change the state of the white border for every frame

	@param {boolean} Whiteborder status
*/
Diagram.prototype.modify_whiteborder = function(value){
	for(var i=0, istop = this.frames.length ; i<istop ;i++)
	{
		this.frames[i].whiteborder = value;
	}
	this.frames[this.current_frame].modify_whiteborder(value);
};

/** Change the duration of each frame of a diagram

	@param {number} Desired new duration
*/
Diagram.prototype.modify_duration = function(new_duration){
	for(var i=0, istop = this.frames.length ; i<istop ;i++)
	{
		this.frames[i].duration = new_duration;
	}
};

/** Encode a string with deflate

	@param {string} Input string
	@return {string} Output encoded string
*/
Diagram.prototype.flate_encode = function (str) {
return $.base64.encode(RawDeflate.deflate(unescape(encodeURIComponent(str))));
};

/** Decode a string with deflate

	@param {string} Input string
	@return {string} Output decoded string
*/
Diagram.prototype.flate_decode = function(str) {
return decodeURIComponent(escape(RawDeflate.inflate($.base64.decode(str))));
};

/** Generate a gif from the diagram data*/
Diagram.prototype.getGIF = function(){
	var encoder = new GIFEncoder();
	encoder.setRepeat(0); // sets an infinite loop
	encoder.start();
	encoder.setQuality(1); // 1: best; 10: default (okay but faster); over 20: meh; todo: quality set by user ?
	for(var i=0, istop = this.frames.length ; i<istop ;i++)
	{
		this.goto_frame(i);
		encoder.setDelay(this.frames[i].duration*16.6666); // minimal delay is about 0.02s; setDelay expect millisec as parameters
		this.painter.exportImage();
		encoder.addFrame(this.painter.ContextExport);
	}
	encoder.finish();
	var binary_gif = encoder.stream().getData();
	document.getElementById('export-gif').src = 'data:image/gif;base64,'+$.base64.encode(encoder.stream().getData());
};

/* --------------------------- */
/* -- Modifications (basic) -- */
/* --------------------------- */
/** Remove a block at the given coordinate.

	@param {number} x Horizontal coordinate
	@param {number} y Vertical coordinate
*/
Frame.prototype.removeBlock = function(x,y){
	this.playfield[x][y][0] = '';
	this.painter.eraseBlock(x,y);
	this.painter.modifyThumbnail(x,y,'E',this.id,"inactive");
	if (this.whiteborder)
	{
		this.painter.drawLocalWhiteBorder(this.playfield,x,y,'inactive');
	}

};

/** Remove a decoration block at the given coordinate.

	@param {number} x Horizontal coordinate
	@param {number} y Vertical coordinate
*/
Frame.prototype.removeDeco = function(x,y){
	this.painter.drawDeco(x,y,this.playfield[x][y][1],'eraser');
	this.playfield[x][y][1] = '';
};

/** Modify the next pieces.

		@param {number} position Define which position will be modified. 0 is hold, 1 is the next1 piece, 2 is the next2 piece, ...
		@param {string} type Type of the tetraminmo. Possible value: (SZLJTOIG)
	*/
Frame.prototype.modify_nexthold = function(position,type){
	this.nexthold[position] = type;
};

/** Modify the active piece.

	@param {number} level Opacity level, a number between 0 and 1.
*/
Frame.prototype.modify_AP_opacity = function(level){
	this.activePieceOpacity = level;
	this.painter.changeActiveOpacity(level);
	if (level == 'Flash' || level == 'flash')
	{
	  this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'Flash',false);
	}

};

/**Changes the rotation system and call a redraw.

	@param {string} system Desired rotation system
*/
Frame.prototype.modify_RS = function(system){
	this.RS = system;
	this.draw();
};
/** Changes the duration of a frame.

	@param {number} new_duration Desired new duration.
*/
Frame.prototype.modify_duration = function(new_duration){
	this.duration = new_duration;
};

/** Changes the border type.

	@param {string} kind Desired border type. Currently supported:
		'master' (gray-bluish), 'easy' (green) and 'death' (red). Defaults to master if
		none is selected
*/
Frame.prototype.modify_border = function(new_border){
	this.border = new_border;
	this.painter.drawBorder(this.border);
};

/** Change the whiteborder status (on or off)
	@param {boolean} Whiteborder status
*/
Frame.prototype.modify_whiteborder = function(new_border){
	this.whiteborder = new_border;
	if (this.whiteborder)
	{
		this.painter.drawWhiteBorder(this.playfield);
	}
	else
	{
		this.painter.eraseLayer('whiteborder');

	}

};

/* ----------------------------- */
/* -- Modifications (advanced)-- */
/* ----------------------------- */

/** 	Fill the playfield with a piece type, similar to a 'paint bucket' tool. Thanks DigitalDevil for the original code !

	@param {number} x Horizontal coordinate
	@param {number} y Vertical coordinate
	@param {string} replaced Possible value: SZLJTOIG
	@param {string} replacer Possible value: SZLJTOIG
*/
Frame.prototype.recursive_fill = function(x,y, replaced, replacer) {

	x = parseFloat(x);
	y = parseFloat(y);

	if (this.playfield[x][y][0] != replaced)
		{return;}

	this.modify(x, y, replacer);
	this.painter.drawBlock(x,y,replacer,this.RS,'inactive');
	if (this.whiteborder)
		{this.painter.drawLocalWhiteBorder(this.playfield,x,y);}

	if (y-1 >= 0)
		{this.recursive_fill(x, y-1, replaced, replacer);}

	if (y+1 < this.height)
		{this.recursive_fill(x, y+1, replaced, replacer);}

	if (x+1 < this.width)
		{this.recursive_fill(x+1, y, replaced, replacer);}

	if (x-1 >= 0)
		{this.recursive_fill(x-1, y, replaced, replacer);}
};

Frame.prototype.stack_lines = function(){
	var row_empty = true;
	for (var j = 0, jstop = this.height; j < jstop; j++) // start at the top row and go down
		{
			row_empty = true;
			// searches the row to find out how many blocks are in it
			for (var i = 0, istop = this.width; i < istop; i++)
			{
				if (this.playfield[i][j][0])
				{
					row_empty = false;
				}
			}
	
			// if the line is empty, shift the upwards rows
			if (row_empty)
			{
				// shifts rows down beginning at specified row and going up
				for (k = j; k > -1; k--)
				{
					// if not the top row, copy row above
					if ( k != 0)
					{
						for (i = 0; i < this.width; i++)
						{
							this.modify(i, k, this.playfield[i][k-1][0]);
						}
					}
				}
			}
		}
	this.painter.eraseLayer('inactive');
	this.draw();
};

Frame.prototype.clear_lines = function(){
	var row_occupation = 0; // to track how many blocks are on a row
	for (var j = 0, jstop = this.height; j < jstop; j++) // start at the top row and go down
		{
			row_occupation = 0;
			// searches the row to find out how many blocks are in it
			for (var i = 0, istop = this.width; i < istop; i++)
			{
				if (this.playfield[i][j][0])
				{
					row_occupation++;
				}
			}
	
			// clears line if row is completely occupied
			if (row_occupation == this.width)
			{
				for (var k=0,kstop = this.width;k<kstop;k++)
				{
					this.removeBlock(k,j);
				}
			}
		}
};
/* ------------------------ */
/* -- Active piece stuff -- */
/* ------------------------ */

/**'Paint' the active piece into the inactive layer
*/
Frame.prototype.paintActivePiece = function(){
	if(this.activePiecePositionX)
	{
		this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'inactive',false);

	}
};

/** Set the active piece variable to zero, paint the active piece
*/
Frame.prototype.lockActivePiece = function(){
	if(this.activePiecePositionX)
	{
		this.paintActivePiece();
		this.clear('active');
		this.activePieceOpacity = 1.0;
		this.painter.eraseLayer('active');
	}
};

/** Call addPiece at the same coordinate than the current one, only with the drop flag on,
effectively dropping the active piece
*/
Frame.prototype.dropActivePiece = function(){
		if(this.activePiecePositionX)
	{

		this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'active',true);
	}
};

/** Move the active piece in the given direction by calling addPiece again

	@param {string} direction Direction in which the piece move. Possible value:'left', 'right', 'up', 'down'
	*/
Frame.prototype.moveActivePiece = function(direction){
	if((this.activePieceType == "I" && this.activePiecePositionX >= -1) || this.activePiecePositionX >= 0)
	{
		var posX = this.activePiecePositionX;
		var posY = this.activePiecePositionY;
		switch(direction)
		{
			case 'left':
				posX--;
			break;
			case 'right':
				posX++;
			break;
			case 'up':
				posY--;
			break;
			case 'down':
				posY++;
			break;
		}
		if (this.piece_is_in(posX,posY,this.activePieceType,this.activePieceOrientation))
		{
			if($('#checkbox-collision').is(':checked'))
			{
				if(!(this.is_piece_colliding(posX,posY,this.activePieceType,this.activePieceOrientation)))
				{
					this.addPiece(posX,posY,this.activePieceType,this.activePieceOrientation,'active',false);
				}
			}
			else
			{
				this.addPiece(posX,posY,this.activePieceType,this.activePieceOrientation,'active',false);
			}
			
		}
	}
};

/** Rotate the active piece in the given direction by calling addPiece again

	@param {string} direction Direction in which the piece rotate. Possible value:'cw', 'ccw'
	*/
Frame.prototype.rotateActivePiece = function(direction){

	// this could use a serious rewrite
	var ori = this.activePieceOrientation;

	switch(direction)
	{
		case 'cw':
			switch(ori)
			{
				case 'i':
					ori = 'cw';
				break;
				case 'cw':
					ori = 'u';
				break;
				case 'u':
					ori = 'ccw';
				break;
				case 'ccw':
					ori = 'i';
				break;
			}
		break;
		case 'ccw':
			switch(ori)
			{
				case 'i':
					ori = 'ccw';
				break;
				case 'ccw':
					ori = 'u';
				break;
				case 'u':
					ori = 'cw';
				break;
				case 'cw':
					ori = 'i';
				break;
			}
		break;

	}
	
	function ARS_wallkick(self){
		if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX+1),self.activePiecePositionY,self.activePieceType,ori)))
			{self.addPiece(parseInt(self.activePiecePositionX+1),self.activePiecePositionY,self.activePieceType,ori,'active',false);}
		else if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX-1),self.activePiecePositionY,self.activePieceType,ori)))
			{self.addPiece(parseInt(self.activePiecePositionX-1),self.activePiecePositionY,self.activePieceType,ori,'active',false);}
	}

	function SRS_wallkick(self,initialOrientation,direction,isI){
		var offset2,offset3,offset4,offset5;
		// the table's y-coordinate are opposite of those from the wiki because tedige assume positive y is downwards whereas the wiki uses positive y as downwards
		if(isI)
		{
		switch(direction)
			{
				case 'cw':
					switch(initialOrientation)
					{
						case 'i':
							offset2 = [-2,0];
							offset3 = [1,0];
							offset4 = [-2,1];
							offset5 = [1,-2];
						break;
						case 'cw':
							offset2 = [-1,0];
							offset3 = [2,0];
							offset4 = [-1,-2];
							offset5 = [2,1];
						break;
						case 'u':
							offset2 = [2,0];
							offset3 = [-1,0];
							offset4 = [2,-1];
							offset5 = [-1,2];
						break;
						case 'ccw':
							offset2 = [1,0];
							offset3 = [-2,0];
							offset4 = [1,2];
							offset5 = [-2,-1];
						break;
					}
				break;
	
				case 'ccw':
					switch(initialOrientation)
					{
						case 'i':
							offset2 = [-1,0];
							offset3 = [2,0];
							offset4 = [-1,-2];
							offset5 = [2,-1];
						break;
						case 'cw':
							offset2 = [2,0];
							offset3 = [-1,0];
							offset4 = [2,-1];
							offset5 = [-1,2];
						break;
						case 'u':
							offset2 = [1,0];
							offset3 = [-2,0];
							offset4 = [1,2];
							offset5 = [-2,-1];
						break;
						case 'ccw':
							offset2 = [-2,0];
							offset3 = [1,0];
							offset4 = [-2,1];
							offset5 = [1,-2];
						break;
					}
				break;	
			}

		}
		else{
		switch(direction)
			{
				case 'cw':
					switch(initialOrientation)
					{
						case 'i':
							offset2 = [-1,0];
							offset3 = [-1,-1];
							offset4 = [0,2];
							offset5 = [-1,2];
						break;
						case 'cw':
							offset2 = [1,0];
							offset3 = [1,1];
							offset4 = [0,-2];
							offset5 = [1,-2];
						break;
						case 'u':
							offset2 = [1,0];
							offset3 = [1,-1];
							offset4 = [0,2];
							offset5 = [1,2];
						break;
						case 'ccw':
							offset2 = [-1,0];
							offset3 = [-1,1];
							offset4 = [0,-2];
							offset5 = [-1,-2];
						break;
					}
				break;
	
				case 'ccw':
					switch(initialOrientation)
					{
						case 'i':
							offset2 = [1,0];
							offset3 = [1,-1];
							offset4 = [0,2];
							offset5 = [1,2];
						break;
						case 'cw':
							offset2 = [1,0];
							offset3 = [1,1];
							offset4 = [0,-2];
							offset5 = [1,-2];
						break;
						case 'u':
							offset2 = [-1,0];
							offset3 = [-1,-1];
							offset4 = [0,2];
							offset5 = [-1,2];
						break;
						case 'ccw':
							offset2 = [-1,0];
							offset3 = [-1,1];
							offset4 = [0,-2];
							offset5 = [-1,-2];
						break;
					}
				break;	
			}

		}
		
		if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX+offset2[0]),parseInt(self.activePiecePositionY+offset2[1]),self.activePieceType,ori)))
		{
			self.addPiece(parseInt(self.activePiecePositionX+offset2[0]),parseInt(self.activePiecePositionY+offset2[1]),self.activePieceType,ori,'active',false);
		}
		else if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX+offset3[0]),parseInt(self.activePiecePositionY+offset3[1]),self.activePieceType,ori)))
		{
			self.addPiece(parseInt(self.activePiecePositionX+offset3[0]),parseInt(self.activePiecePositionY+offset3[1]),self.activePieceType,ori,'active',false);
		}
		else if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX+offset4[0]),parseInt(self.activePiecePositionY+offset4[1]),self.activePieceType,ori)))
		{
			self.addPiece(parseInt(self.activePiecePositionX+offset4[0]),parseInt(self.activePiecePositionY+offset4[1]),self.activePieceType,ori,'active',false);
		}
		else if(!(self.is_piece_colliding(parseInt(self.activePiecePositionX+offset5[0]),parseInt(self.activePiecePositionY+offset5[1]),self.activePieceType,ori)))
		{
			self.addPiece(parseInt(self.activePiecePositionX+offset5[0]),parseInt(self.activePiecePositionY+offset5[1]),self.activePieceType,ori,'active',false);
		}
	}
	
	if($('#checkbox-collision').is(':checked'))
	{
		if((this.is_piece_colliding(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,ori))) // is the new position is not colliding with something
		{
			if($('#checkbox-wallkick').is(':checked'))
				{
				switch(this.RS)
				{
					case 'ARS': // ARS wallkick, TGM2 flavor (no floorkick, no I kick)
						switch(this.activePieceType)
						{
							case "J":
								if(this.activePieceOrientation == 'i')
								{
									if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+2,10)] || 
									this.playfield[parseInt(this.activePiecePositionX-1+2,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										ARS_wallkick(this.sself);
									}					
									else if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+1,10)] || 
											this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										// do nothing
									}
									else{
										ARS_wallkick(this.sself);
									}
								}
								else if(this.activePieceOrientation == 'u')
								{
									if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+2,10)] || 
									this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										// do nothing
									}
									else{
										ARS_wallkick(this.sself);
									}
								}
								else{
								ARS_wallkick(this.sself);
								}
							break;
			
							case "L":
								if(this.activePieceOrientation == 'i')
								{
									if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+2,10)] || 
									this.playfield[parseInt(this.activePiecePositionX-1+0,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										ARS_wallkick(this.sself);
									}					
									else if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+1,10)] || 
									this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										// do nothing
									}
									else{
										ARS_wallkick(this.sself);
									}
								}
								else if(this.activePieceOrientation == 'u')
								{
									if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+2,10)] || 
									this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										// do nothing
									}
									else{
										ARS_wallkick(this.sself);
									}
								}
								else{
								ARS_wallkick(this.sself);
								}
							break;
			
							case "T":
								if(this.activePieceOrientation == 'u' || this.activePieceOrientation == 'i')
								{
									if(this.playfield[parseInt(this.activePiecePositionX-1+1,10)][parseInt(this.activePiecePositionY-1+0,10)])
									{
										// do nothing
									}
									else{
										ARS_wallkick(this.sself);
									}
								}					
								else{
									ARS_wallkick(this.sself);
								}
								
							break;
			
								
							default:
							ARS_wallkick(this.sself);
							break;
						}
					break;
					
					case 'SRS':
						if(this.activePieceType == 'I')
						{
							SRS_wallkick(this.sself,this.activePieceOrientation, direction,true);
						}
						else{
							SRS_wallkick(this.sself,this.activePieceOrientation, direction,false);						
						}
					
					break;
				}
			}
		}
		else{ // if everything is normal
			this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,ori,'active',false);
		}
	}
	else
	{
		this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,ori,'active',false);
	}

};

$(document).ready(function(){
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* --------------------------- GLOBAL STUFF -------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */

	// Default state for the tetramino selection
	$('input[type=radio][name="select"][value=Ii]').attr('checked',true);
	$('input[type=radio][name="editor-tab"][value=inactive]').attr('checked',true);
	// Interface global constant
	var IS_CLICKING;
	// current tools:
	var TOOL_DROP = false;
	var TOOL_FILL = false;
	var TOOL_RECTANGULAR = false;
	var TOOL_PENCIL = false;
	var TOOL_ERASER = false; // todo: use hidden checkbox instead
	var TOOL_ERASER_DECO = false;
	// current panel
	var	DECORATION_PANEL = false;
	var	TETRAMINO_PANEL = true;
	var APCONTROL_PANEL = false;

	// initialization of the system
	var aPainter = new Painter('pf');
	var aDiag = new Diagram(aPainter);
	aDiag.init();
	aPainter.init();

	var initiator = setInterval(function(){
		if(aPainter.ready) {
			clearInterval(initiator);
			drawPalette('ARS',8,aPainter.sprite);
			drawPaletteDeco(8,aPainter.spritedeco);
			var URLsearch = window.location.search;
			if(URLsearch) // load if there's something in the url
			{
				$('#import').val(URLsearch);
				$('#import-button').click();
			}
			//aDiag.frames[0].addPiece(0,3,'I','cw','active',false);
			//aDiag.frames[0].addPiece(2,11,'I','cw','inactive',false);
			//console.log('done');
			//aDiag.new_copy_frame();
			//aDiag.frames[1].addPiece(7,8,'T','u','inactive');
			//aDiag.frames[1].addPiece(5,6,'S','ccw','inactive');
			//aDiag.frames[0].load('I~Ibdbebfbgbhcedfeefdfefffgfh~Sgdgdgegfggghhdhfhhidihjdjh_');
			//aDiag.frames[1].load('N~ISZ_J~p8_C~rhhp_I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_');
			//aDiag.new_frame();
			//aDiag.frames[2].load('N~JJZ_J~p8_C~rhpr_I~Sadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Ihdhdhehfhhidifihjdjfjgjh_');
			//aDiag.frames[2].draw();
		}
	},10);

	/** Get the jQuery object of the export canvas.*/
	aPainter.CanvasExport = $('#pf-export');
	/** Get the 2d context of the related canvas*/
	aPainter.ContextExport = aPainter.CanvasExport[0].getContext('2d');


	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* --------------------------- MOUSE MANAGEMENT  --------------------------- */
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */


	aDiag.painter.CanvasPreview.mousemove(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		// this.PFOriginX,this.PFOriginY, 10*this.block, 20*this.block
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY < aDiag.painter.PFOriginYAbsolute){}

			// if the mouse is in the playfield
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
				aDiag.painter.eraseLayer('preview'); //erase the preview layer
				// depending on the current active panel...
				if(TETRAMINO_PANEL)
				{
					//console.log('['+mouseX+','+mouseY+']');
					//console.log('['+pfX+','+pfY+']');
					var extract = $('input[type=radio][name=select]:checked').attr('value');
					var type = extract.charAt(0);
					var orientation = extract.slice(1);
					var mode = '';
					// set the right mode
					if ($('#checkbox-active').is(':checked'))
						{mode ='active';}
					// set the right mode
					else
						{mode='inactive';}
					if ($('#checkbox-garbage').is(':checked'))
						{mode ='garbage';}

					if (IS_CLICKING)
						{
							//aDiag.painter.highlight(pfX,pfY);
							if (TOOL_PENCIL)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton',mode,TOOL_DROP);}
							else if (TOOL_ERASER)
								{aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);}
							else
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);}
						}
					else
						{
							if (TOOL_ERASER)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,'G','singleton','preview',TOOL_DROP);}
							else if(TOOL_FILL || TOOL_PENCIL)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton','preview',TOOL_DROP);}
							else
							{
								if (type == 'I') { //offset I so it doesn't look weird on mouseover
									aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,'preview',TOOL_DROP);}
								else
									{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,'preview',TOOL_DROP);}
							}
						}
				}
				else
				{
				aDiag.painter.eraseLayer('preview'); //erase the preview layer
					if(TOOL_ERASER_DECO){
					aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,'G','singleton','preview',TOOL_DROP);
					}
					else
					{
						var extract = $('input[type=radio][name="select-deco"]:checked').attr('value');
						aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,extract,'singleton','decoration-preview',false);

					}

				}
			}
	//var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
	//console.log("( e.clientX, e.clientY ) : " + clientCoords);
	});// CanvasPreview.mousemove

	/*Event: CanvasPreview.click
	Manages the click event on the outermost canvas*/
	aDiag.painter.CanvasPreview.mousedown(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
					//aDiag.painter.highlight(pfX,pfY);
				if(TETRAMINO_PANEL)
				{
					var extract = $('input[type=radio][name="select"]:checked').attr('value');
					var type = extract.charAt(0);
					var orientation = extract.slice(1);
					var mode = '';


					if ($('#checkbox-active').is(':checked'))
					{
						mode ='active';
					}
					else{
						mode='inactive';
					}

					if ($('#checkbox-garbage').is(':checked'))
						{
						mode ='garbage';
						}


					if (TOOL_FILL && type != aDiag.frames[aDiag.current_frame].lookup(pfX,pfY)) {
						aDiag.frames[aDiag.current_frame].recursive_fill(pfX,
																			pfY,
																			aDiag.frames[aDiag.current_frame].lookup(pfX,pfY),
																			type);
						//addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
						//aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
						}
						else if (TOOL_PENCIL)
						{
							aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton',mode,TOOL_DROP);
						}
						else if (TOOL_ERASER)
						{
							aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);
						}
						else
						{
							if (type == 'I') { //offset I so it doesn't look weird on mouseover
								if(aDiag.frames[aDiag.current_frame].lookup(pfX,pfY)) // erase on occucupied case here
								{
									aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,'erase',TOOL_DROP);
								}
								else
								{
								aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,mode,TOOL_DROP);
								}
							}
							else
							{
								if(aDiag.frames[aDiag.current_frame].lookup(pfX,pfY))  // erase on occucupied case here
								{
									aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,'erase',TOOL_DROP);
								}
								else
								{
								aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
								}
							}
						}

				}
			else // aka if(DECORATION_PANEL)
			{
				if(TOOL_ERASER_DECO)
				{
					aDiag.frames[aDiag.current_frame].removeDeco(pfX,pfY);
				}
				else
				{
				var extract = $('input[type=radio][name="select-deco"]:checked').attr('value');
				aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,extract,'singleton','decoration',false);
				//aDiag.frames[aDiag.current_frame].drawDeco(pfX,pfY,extract);
				}
			}
		}
	});//end CanvasPreview.mousedown

	/*Event: CanvasControl.click
	Manages the click event on the joystick visualisation canvas*/
	aDiag.painter.CanvasControl.mousedown(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		var height = aDiag.painter.CanvasControl.height();
		var direction;
		if (mouseX < height + aDiag.painter.CntrlOriginX) // that if separates the joystick and the button
		{
			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//ul
				direction = 'ul';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//u
				direction = 'u';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + height &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//ur
				direction = 'ur';
			}

			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//l
				direction = 'l';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//center
				aDiag.painter.resetJoystick();
				aDiag.frames[aDiag.current_frame].modify_control('c','rest');
				aPainter.drawJoystick('c','rest');
				return;
			}


			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//r
				direction = 'r';
			}


			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//dl
				direction = 'dl';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//d
				direction = 'd';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//dr
				direction = 'dr';
				//aDiag.painter.drawJoystick('dr','holded')
			}

			if (direction != aDiag.frames[aDiag.current_frame].joystick_direction)
			{
				aDiag.painter.resetJoystick();
				aDiag.frames[aDiag.current_frame].modify_control(direction,'pressed');
				aPainter.drawJoystick(direction,'pressed');
			}
			else
			{
				switch(aDiag.frames[aDiag.current_frame].joystick_state)
				{
				case 'rest':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'pressed');
					aPainter.drawJoystick(direction,'pressed');

				break;
				case 'pressed':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'holded');
					aPainter.drawJoystick(direction,'holded');
				break;
				case 'holded':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'rest');
					aPainter.drawJoystick(direction,'rest');
				break;
				default: break;
				}
			}

		} // end joystick

		if (mouseX > height + aDiag.painter.CntrlOriginX) //buttons
		{
			var radius = height/5;
			var button = '';
			var index = '';

			if(mouseX < height+height/4+radius + aDiag.painter.CntrlOriginX &&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				//A
				button = 'A';
			}
			if(mouseX > height+height/4+2*radius+height/16-radius + aDiag.painter.CntrlOriginX &&
				mouseX < height+height/4+2*radius+height/16+radius + aDiag.painter.CntrlOriginX &&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				// B
				button = 'B';
			}
			if(mouseX > height+height/4+4*radius+2*height/16-radius + aDiag.painter.CntrlOriginX&
				mouseX < height+height/4+4*radius+2*height/16+radius + aDiag.painter.CntrlOriginX&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				// C
				button = 'C';
			}

			if(mouseX < height+height/4+radius + aDiag.painter.CntrlOriginX &&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// D
				button = 'D';
			}
			/*
			if(mouseX > height+height/4+2*radius+height/16-radius + aDiag.painter.CntrlOriginX &&
				mouseX < height+height/4+2*radius+height/16+radius + aDiag.painter.CntrlOriginX &&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// E
				button = 'E';
			}
			if(mouseX > height+height/4+4*radius+2*height/16-radius + aDiag.painter.CntrlOriginX&
				mouseX < height+height/4+4*radius+2*height/16+radius + aDiag.painter.CntrlOriginX&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// F
				console.log ('F');
			}
			*/

			switch(button)
			{
				case 'A': index = 0; break;
				case 'B': index = 1; break;
				case 'C': index = 2; break;
				case 'D': index = 3; break;
				case 'E': index = 4; break;
				case 'F': index = 5; break;
			}
			switch(aDiag.frames[aDiag.current_frame].button_state[index])
			{
				case 'pressed':
					aDiag.frames[aDiag.current_frame].modify_button(button,'holded');
					aPainter.drawButton(button,'holded');
					break;
				case 'holded':
					aDiag.frames[aDiag.current_frame].modify_button(button,'rest');
					aPainter.drawButton(button,'rest');
					break;
				case 'rest':
					aDiag.frames[aDiag.current_frame].modify_button(button,'pressed');
					aPainter.drawButton(button,'pressed');
					break;
			}
		}//end buttons



		// aDiag.painter.CntrlOriginX;
		// aDiag.painter.CntrlOriginY;

	});//end CanvasControl.click


	/*Event: CanvasNextHold.click
	Manages the click event on the next & hold canvas*/
	aDiag.painter.CanvasNextHold.click(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		//console.log('['+mouseX+','+mouseY+']');
		//var pfX = parseInt(Math.floor((mouseX)/aDiag.painter.blockSize),10);
		//var pfY = parseInt(Math.floor((mouseY)/aDiag.painter.blockSize),10);
		var pfX = parseInt(1+((mouseX - aDiag.painter.CanvasNextHold.offset().left)/aDiag.painter.blockSize),10);
		var pfY = parseInt(1+((mouseY - aDiag.painter.CanvasNextHold.offset().top)/aDiag.painter.blockSize),10);
		var extract = $('input[type=radio][name=select]:checked').attr('value');
		var type = extract.charAt(0);
		if (pfX >= 0 && pfX < 4) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[0])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(0,type);
				aDiag.painter.drawNextHold(0,type,aDiag.frames[aDiag.current_frame].RS);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(0,'');
				aDiag.painter.drawNextHold(0,'',aDiag.frames[aDiag.current_frame].RS);
			}

		}
		if (pfX >= 4 && pfX < 8) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[1])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(1,type);
				aDiag.painter.drawNextHold(1,type,aDiag.frames[aDiag.current_frame].RS);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(1,'');
				aDiag.painter.drawNextHold(1,'',aDiag.frames[aDiag.current_frame].RS);
			}
		}
		if (pfX >= 8 && pfX < 11) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[2])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(2,type);
				aDiag.painter.drawNextHold(2,type,aDiag.frames[aDiag.current_frame].RS);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(2,'');
				aDiag.painter.drawNextHold(2,'',aDiag.frames[aDiag.current_frame].RS);
			}
		}
		if (pfX >= 11) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[3])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(3,type);
				aDiag.painter.drawNextHold(3,type,aDiag.frames[aDiag.current_frame].RS);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(3,'');
				aDiag.painter.drawNextHold(3,'',aDiag.frames[aDiag.current_frame].RS);
			}
		}

	}); //end CanvasNextHold.click

	/* ------------------------------------------------------------------------- */
	/* --------------------------- BUTTON MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */
	/*--- Playfield ---*/
	$('#pf-cmd_first').click(function(){
		aDiag.first_frame();

	});

	$('#pf-cmd_prev').click(function(){
		aDiag.previous_frame();
		opacity_highlight_remove();
		opacity_auto_highlight();
	});

	$('#pf-cmd_next').click(function(){
		if(aDiag.current_frame < aDiag.frames.length - 1){
			aDiag.next_frame();
			opacity_highlight_remove();
			opacity_auto_highlight();
		}
		else
		{
			$('#pf-cmd_clone').click();
		}
	});

	$('#pf-cmd_last').click(function(){
		aDiag.last_frame();
	});
	
	// Progressbar
	$('#pf-current-frame').blur(function(){
		if ($('#pf-current-frame').val() > 0 && $('#pf-current-frame').val() <= aDiag.frames.length)
		{aDiag.goto_frame(parseInt($('#pf-current-frame').val()-1,10));}
	});

	// Comment
	$('#pf-comment').blur(function(){
		aDiag.frames[aDiag.current_frame].comment = $(this).val();
	});

	/*--- Active piece buttons ---*/
	function sync_joy(direction){
		console.log("test");
		aDiag.painter.resetJoystick();
		aDiag.frames[aDiag.current_frame].modify_control(direction,'pressed');
		aPainter.drawJoystick(direction,'pressed');
	}

	function sync_button(button){
		aDiag.frames[aDiag.current_frame].modify_button(button,'pressed');
		aPainter.drawButton(button,'pressed');
	}
	$('#cmd_move_up').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}

		if($('#sync-movement:checked').val())
		{
			sync_joy("u");
		}

		aDiag.frames[aDiag.current_frame].moveActivePiece('up');
		
	});
	$('#cmd_move_down').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}
		if($('#sync-movement:checked').val())
		{
			sync_joy("d");
		}
		aDiag.frames[aDiag.current_frame].moveActivePiece('down');
	});
	$('#cmd_move_left').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}
		if($('#sync-movement:checked').val())
		{
			sync_joy("l");
		}
		aDiag.frames[aDiag.current_frame].moveActivePiece('left');
	});
	$('#cmd_move_right').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}
		if($('#sync-movement:checked').val())
		{
			sync_joy("r");
		}
		aDiag.frames[aDiag.current_frame].moveActivePiece('right');
	});

	$('#cmd_ccw').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}
		if($('#sync-movement:checked').val())
		{
			sync_button("A");
		}
		aDiag.frames[aDiag.current_frame].rotateActivePiece('ccw');
	});
	$('#cmd_cw').mousedown(function(){
		if($('#pf-auto-action-frame-increment:checked').val())
		{
			$('#pf-cmd_clone').click();
		}
		if($('#sync-movement:checked').val())
		{
			sync_button("B");
		}
		aDiag.frames[aDiag.current_frame].rotateActivePiece('cw');
	});

	$('#cmd_paint').mousedown(function(){
		aDiag.frames[aDiag.current_frame].paintActivePiece();
	});
	$('#cmd_lock').mousedown(function(){
		aDiag.frames[aDiag.current_frame].lockActivePiece();
		if(IS_TIMING)
		{
			$('#cmd_reset_timer').click();
		}
		
	});
	$('#cmd_drop').mousedown(function(){
		aDiag.frames[aDiag.current_frame].dropActivePiece();
	});
	
	$('#pf-duration').blur(function(){
		aDiag.frames[aDiag.current_frame].duration = parseFloat($(this).val());
	});

	$('#pf-active-opacity').blur(function(){
		aDiag.frames[aDiag.current_frame].modify_AP_opacity($(this).val());
	});
	// TODO: var $cmd_opacity_3 = $('#cmd_opacity_3') 

	var $cmd_opacity_none = $('#cmd_opacity_none'),
	$cmd_opacity_3 = $('#cmd_opacity_3'),
	$cmd_opacity_2 = $('#cmd_opacity_2'),
	$cmd_opacity_1 = $('#cmd_opacity_1'),
	$cmd_opacity_lock = $('#cmd_opacity_lock'),
	$cmd_opacity_flash = $('#cmd_opacity_flash'); 

	function opacity_highlight_remove(){
		$cmd_opacity_none.removeClass('pressed');
		$cmd_opacity_3.removeClass('pressed');
		$cmd_opacity_2.removeClass('pressed');
		$cmd_opacity_1.removeClass('pressed');
		$cmd_opacity_lock.removeClass('pressed');
		$cmd_opacity_flash.removeClass('pressed');
	}
	function opacity_auto_highlight(){
		switch($('#pf-active-opacity').val()){
		case '1.0':
			$('#cmd_opacity_none').addClass('pressed')
			break;
		case '0.9':
			$('#cmd_opacity_3').addClass('pressed')
			break;
		case '0.8':
			$('#cmd_opacity_2').addClass('pressed')
			break;
		case '0.7':
			$('#cmd_opacity_1').addClass('pressed')
			break;
		case '0.55':
			$('#cmd_opacity_lock').addClass('pressed')
			break;
		case 'Flash':
			$('#cmd_opacity_flash').addClass('pressed')
			break;
		}
	}

	// TODO more cache !

	$('#cmd_opacity_none').click(function(){
		$('#pf-active-opacity').val('1.0').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});
	$('#cmd_opacity_3').click(function(){
		$('#pf-active-opacity').val('0.9').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});
	$('#cmd_opacity_2').click(function(){
		$('#pf-active-opacity').val('0.8').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});
	$('#cmd_opacity_1').click(function(){
		$('#pf-active-opacity').val('0.7').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});
	$('#cmd_opacity_lock').click(function(){
		$('#pf-active-opacity').val('0.55').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});
	$('#cmd_opacity_flash').click(function(){
		$('#pf-active-opacity').val('Flash').blur();
		opacity_highlight_remove();
		$(this).addClass('pressed');
	});

	var TIMER, TIMER_MODE,IS_TIMING = false;
	$('#cmd_reset_timer').click(function(){
		IS_TIMING = true;
		TIMER = 1;
		$('#indic').html(parseInt(TIMER_MODEL[$('#timer-select').val()].lock-TIMER,10)+' frames left until lock');
		$('#cmd_timer_tick').attr('style','');
		$('#cmd_reset_timer').attr('style','');
		$('#hr_tick').attr('style','');
	});

	$('#cmd_startstop_timer').click(function(){
		
		if(IS_TIMING) // -> stop timer
		{
			$(this).attr('value','Start timer');
			IS_TIMING = false;
			$('#indic').html('');
			$('#cmd_reset_timer').attr('style','display:none');
			$('#cmd_timer_tick').attr('style','display:none');
			$('#hr_tick').attr('style','display:none;');
		}
		else // -> start timer
		{
			$(this).attr('value','Stop timer');
			IS_TIMING = true;
			TIMER = 1;
			$('#indic').html(parseInt(TIMER_MODEL[$('#timer-select').val()].lock-TIMER,10)+' frames left until lock');
			$('#cmd_timer_tick').attr('style','');
			$('#cmd_reset_timer').attr('style','');
			$('#hr_tick').attr('style','');
		}
		
	});

	function timer_tick(){
		TIMER++;
		$('#indic').html(parseInt(TIMER_MODEL[$('#timer-select').val()].lock-TIMER,10)+' frames left until lock');
		if(TIMER <= TIMER_MODEL[$('#timer-select').val()].separation1) // 12
		{
			$('#cmd_opacity_none').click();
		}
		if (TIMER <= TIMER_MODEL[$('#timer-select').val()].separation2 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation1) //18
		{
			$('#cmd_opacity_3').click();
		}
		if (TIMER <= TIMER_MODEL[$('#timer-select').val()].separation3 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation1 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation2) //24
		{
			$('#cmd_opacity_2').click();
		}
		if (TIMER <= TIMER_MODEL[$('#timer-select').val()].separation4 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation1 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation2 &&
			TIMER > TIMER_MODEL[$('#timer-select').val()].separation3) // 30
		{
			$('#cmd_opacity_1').click();
		}
		if(TIMER  == parseInt(TIMER_MODEL[$('#timer-select').val()].separation4)) // 30
		{
			$('#cmd_opacity_lock').click();
			$('#indic').html('Lock');
		}
		if(TIMER  == parseInt(1+TIMER_MODEL[$('#timer-select').val()].separation4)) // 30
		{
			$('#cmd_opacity_flash').click();
			$('#indic').html('Flash');
		}
		if(TIMER  == parseInt(2+TIMER_MODEL[$('#timer-select').val()].separation4)) // 30
		{
			$('#cmd_opacity_flash').click();
			$('#indic').html('Flash');
		}
		if(TIMER  > parseInt(2+TIMER_MODEL[$('#timer-select').val()].separation4)) // 30
		{
			$('#indic').html('Locked!');
			$('#cmd_lock').click();
			$('#cmd_startstop_timer').click();
		}
		
	}
	var TIMER_MODEL = {
		TGM1: {
			ARE: 30,
			lock: 30, // 30 -1
			separation1: 12, // +12f = 40%
			separation2: 18, // +6f = 20%
			separation3: 24, // +6f = 20%
			separation4: 30 // +6f =20%
			// 
			},
		Master000699:{
			ARE: 25,
			lock: 30,
			separation1: 12,
			separation2: 18,
			separation3: 24,
			separation4: 30
		},
		Master700799:{
			ARE: 16,
			lock: 30,
			separation1: 12,
			separation2: 18,
			separation3: 24,
			separation4: 30
		},
		Master800899:{
			ARE: 12,
			lock: 30,
			separation1: 12,
			separation2: 18,
			separation3: 24,
			separation4: 30
		},
		Master900999:{
			ARE: 12,
			lock: 17,
			separation1: 6,
			separation2: 10,
			separation3: 14,
			separation4: 17
		},
		Master10001099:{
			ARE: 6,
			lock: 17,
			separation1: 6,
			separation2: 10,
			separation3: 14,
			separation4: 17
		},
		Master11001199:{
			ARE: 5,
			lock: 15,
			separation1: 6,
			separation2: 10,
			separation3: 13,
			separation4: 15
		},
		Master12001299:{
			ARE: 4,
			lock: 15,
			separation1: 6,
			separation2: 10,
			separation3: 13,
			separation4: 15
		},
		Death000099:{
			ARE: 16,
			lock: 30,
			separation1: 12,
			separation2: 18,
			separation3: 24,
			separation4: 30
		},
		Death100199:{
			ARE: 12,
			lock: 26,
			separation1: 10,
			separation2: 16,
			separation3: 21,
			separation4: 26
		},
		Death200299:{
			ARE: 12,
			lock: 22,
			separation1: 9,
			separation2: 14,
			separation3: 18,
			separation4: 22
		},
		Death300399:{
			ARE: 6,
			lock: 18,
			separation1: 8,
			separation2: 12,
			separation3: 15,
			separation4: 18
		},
		Death400499:{
			ARE: 5,
			lock: 15,
			separation1: 6,
			separation2: 9,
			separation3: 12,
			separation4: 15
		},
		Death500999:{
			ARE: 4,
			lock: 15,
			separation1: 6,
			separation2: 9,
			separation3: 12,
			separation4: 15
		},
		Shirase000199:{
			ARE: 10,
			lock: 18,
			separation1: 8,
			separation2: 12,
			separation3: 15,
			separation4: 18
		},
		Shirase200299:{
			ARE: 10,
			lock: 17,
			separation1: 7,
			separation2: 11,
			separation3: 14,
			separation4: 17
		},
		Shirase300499:{
			ARE: 4,
			lock: 15,
			separation1: 6,
			separation2: 9,
			separation3: 12,
			separation4: 15
		},
		Shirase500599:{
			ARE: 4,
			lock: 13,
			separation1: 6,
			separation2: 9,
			separation3: 11,
			separation4: 13
		},
		Shirase6001099:{
			ARE: 4,
			lock: 12,
			separation1: 6,
			separation2: 8,
			separation3: 10,
			separation4: 12
		},
		Shirase11001199:{
			ARE: 4,
			lock: 10,
			separation1: 4,
			separation2: 6,
			separation3: 8,
			separation4: 10
		},
		Shirase12001299:{
			ARE: 4,
			lock: 8,
			separation1: 4,
			separation2: 6,
			separation3: 7,
			separation4: 8
		},
		TDSSRS:{
			ARE: 1, // 0 in reality
			lock: 30,
			separation1: 10,
			separation2: 17,
			separation3: 25,
			separation4: 30
		}
	}

	/*--- Frame buttons ---*/
	$('#cmd_clear_lines').click(function(){
		aDiag.frames[aDiag.current_frame].clear_lines();
	});
	$('#cmd_stack_lines').click(function(){
		aDiag.frames[aDiag.current_frame].stack_lines();
	});
	$('#cmd_clearstack_lines').click(function(){
		aDiag.frames[aDiag.current_frame].clear_lines();
		aDiag.frames[aDiag.current_frame].stack_lines();
	});

	$('#cmd_clear_inactive').click(function(){
		aDiag.frames[aDiag.current_frame].clear('inactive');
	});
	$('#cmd_clear_active').click(function(){
		aDiag.frames[aDiag.current_frame].clear('active');
	});
	$('#cmd_clear_decoration').click(function(){
		aDiag.frames[aDiag.current_frame].clear('decoration');
	});

	$('#cmd_clear_all').click(function(){
		aDiag.frames[aDiag.current_frame].clear('all');
	});

	$('#activate-white-border').click(function(){
	//change-all-border

		if ($('#activate-white-border:checked').val())
		{
			aDiag.frames[aDiag.current_frame].modify_whiteborder(true);
		}
		else
		{
			aDiag.frames[aDiag.current_frame].modify_whiteborder(false);
		}

	});
	$('#change-all-whiteborder').click(function(){
		aDiag.modify_whiteborder($('#border-select').val());
	});

	$('#border-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_border($('#border-select').val());
	});
	$('#change-all-border').click(function(){
		aDiag.modify_border($('#border-select').val());
	});

	$('#rs-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_RS($('#rs-select').val());
		drawPalette($('#rs-select').val(),8,aPainter.sprite);

	});
	$('#change-all-rs').click(function(){
		aDiag.modify_RS($('#rs-select').val());
	});

	$('#duration-1f').click(function(){
		$('#pf-duration').val('1').blur();
	});
	$('#duration-5f').click(function(){
		$('#pf-duration').val('5').blur();
	});
	$('#duration-15f').click(function(){
		$('#pf-duration').val('15').blur();
	});
	$('#duration-60f').click(function(){
		$('#pf-duration').val('60').blur();
	});
	$('#duration-remaining').click(function(){
	var one = TIMER_MODEL[$('#timer-select').val()].separation1 - TIMER;
	var two = TIMER_MODEL[$('#timer-select').val()].separation2 - TIMER;
	var three = TIMER_MODEL[$('#timer-select').val()].separation3 - TIMER;
	var four = TIMER_MODEL[$('#timer-select').val()].separation4 - TIMER;

	var time_remaining = Math.min((one > 0) ? one : 1000 ,(two > 0) ? two : 1000,(three > 0) ? three : 1000, (four > 0) ? four : 1000);
	aDiag.modify_duration(time_remaining);
	});
	$('#change-all-duration').click(function(){
		aDiag.modify_duration(parseInt($('#pf-duration').val(),10));
		//console.log(parseInt($('#pf-duration').val(),10));
	});

	/*--- Diagram buttons ---*/

	$('#pf-cmd_new').click(function(){
		aDiag.new_frame();
		aDiag.frames[aDiag.current_frame].draw();
	});
	$('#pf-cmd_clone').click(function(){
		aDiag.new_copy_frame();
	});
	$('#pf-cmd_del').click(function(){
		aDiag.remove_current_frame();
		aDiag.frames[aDiag.current_frame].draw();
		aDiag.update_framecount();
	});
	$('#pf-cmd_remove_following').click(function(){
		aDiag.remove_following_frames();
		aDiag.frames[aDiag.current_frame].draw();
		aDiag.update_framecount();
	});

	$('#cmd_nuke').click(function(){
		var confirmation = window.confirm('This will reset everything ! Are you sure ?');
		if (confirmation)
		{
		aDiag.remove_all_playfields();
		aDiag.frames[aDiag.current_frame].draw();
		}
	});
	$('#cmd_timer_tick').click(function(){
		timer_tick();
	});

	$('input[name="auto-are"]').click(function(){
		$('#pf-cmd_clone').click();
		aDiag.frames[aDiag.current_frame].duration = $(this).val();
		$('#pf-cmd_clone').click();
	});	
	/* -------------------------- */

	$('#tetramino-panel table').click(function(){
		$('#tetramino-panel td').removeClass('pressed');
		$('#tetramino-panel input[type=radio]:checked').parent().parent().addClass('pressed');
	});

	$('#panel-decorations').click(function(){
		$('#panel-decorations td').removeClass('pressed');
		$('#panel-decorations table input:checked').parent().parent().addClass('pressed');
	});

	$('#fumen_import').click(function(){

	var fumenstring = $('#import').val();
	var encstr = fumenstring.slice(fumenstring.indexOf('@')); // look for the thing that's after the version metadata
	//'7ebhiipqbxqb5qbiqbqqbyqb6qbjqbrqbzqb7qbkqb?sqb0qb8qblqbtqb1qb9qbmqbuqb2qb+qbnqbvqb3qb/qb';// full rotation
	//var encstr = '7eYKHWOA0BeTASIjRASIyQEF2BAABmBUcBviBLjBWe?BAwNyAU9sJEFb0HEvT98AwSVTASY6dD2488AwA2JEnoo2AD?MeGEzXpTASICKEFbEcEP5BAAMQBOGBrRBtXBqHBpPBEOBv4?A9JBJPBnDBO+ALABdHBFgBdgBlfBAAA';
	//var encstr ='/dD3hbH3ibI3gbH3hbI3gbC3pbAoUxAso2TAySzTAS?ITeDZ2vvAuno2A5H5TASY6dD2488AQ+74Dzoo2Azo2TASo/?QEOAAAA7eEh9OEAlsyfCAAAbKBVJBSFBNdE3kbC3mbC3mbC?3mbC3icAwNEA6HXyD7eVtOqyAFreRAyp+5APGVTAyp78Axn?A6AFr+5AxnA6AFreRAyp7CEFStJEFreRAypeRAyZAAAlecF?ectHBtocFocNyc13cdiBt3cl3cF3cNBd1mBjYBZzcBcBGZB?aYBUycchBAAA";
	
	// srs in a box
	//v110@JcF3jbA3jbA3jbA3jbA3jbA3jbA3jbA3jbA3jbF3Zd?B4i7eCJAcRAcZAcOcAAnbA3AAnbA3AAnbA3AAkbD3AAjbFA?ZdCAc7eWKAcSAcaAcDAcLAcTAcbAcEAcMAcUAccAcFAcNAc?VAcdAcGAcOAcWAceAcHAcPAcXAcfAc

	// ars in a box
	//v110@JcF3jbA3jbA3jbA3jbA3jbA3jbA3jbA3jbA3jbF3Zd?BAc7eCJAcRAcZAcOcAAnbA3AAnbA3AAnbA3AAkbD3AAjbFA?ZdCAc7eWKAcSAcaAcDAcLAcTAcbAcEAcMAcUAccAcFAcNAc?VAcdAcGAcOAcWAceAcHAcPAcXAcfAc
	
	//First, run some actual fumen code, 'cause I (PP) am not a CS genius. Thanks myndzi for the hints about how it works
	// I stripped some useless (for my purposes) part of the code. Gomenasai Mihys-san !
	enclim=32768;
	enc=new Array(enclim+1024);
	enctbl='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	asctbl=' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	framelim=2000;
	f=new Array(220);encf=new Array(220);af=new Array(220*(framelim+1));
	p=new Array(3);ap=new Array(3*(framelim+1));
	au=new Array(framelim);
	am=new Array(framelim);
	ac=new Array(framelim);
	ad=new Array(framelim);
	ct=1;
	b=new Array(
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,1,1,1,2,1,3,1,1,0,1,1,1,2,1,3,0,1,1,1,2,1,3,1,1,0,1,1,1,2,1,3,
	0,1,1,1,2,1,0,2,1,0,1,1,1,2,2,2,2,0,0,1,1,1,2,1,0,0,1,0,1,1,1,2,
	1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,
	0,1,1,1,1,2,2,2,2,0,1,1,2,1,1,2,0,1,1,1,1,2,2,2,2,0,1,1,2,1,1,2,
	0,1,1,1,2,1,1,2,1,0,1,1,2,1,1,2,1,0,0,1,1,1,2,1,1,0,0,1,1,1,1,2,
	0,1,1,1,2,1,2,2,1,0,2,0,1,1,1,2,0,0,0,1,1,1,2,1,1,0,1,1,0,2,1,2,
	1,1,2,1,0,2,1,2,0,0,0,1,1,1,1,2,1,1,2,1,0,2,1,2,0,0,0,1,1,1,1,2
	);

	enclen=0;
	for(i=0;i<encstr.length;i++){
		tmp=enctbl.indexOf(encstr.charAt(i));if(tmp>=0)enc[enclen++]=tmp;
	}
	for(i=enclen;i<enclim;i++)enc[i]=0;
	encc=0;
	fldrepcnt=0;
	for(i=0;i<220;i++)af[i]=0;
	for(e=0;encc<enclen;e++){
		if(fldrepcnt<1){
		for(j=0;j<220;){
			tmp=enc[encc++];tmp+=enc[encc++]*64;
			tmp2=tmp%220;tmp=Math.floor(tmp/220);
			tmp1=tmp%17;tmp=Math.floor(tmp/17);
			for(i=0;i<=tmp2;i++)af[e*220+(j++)]+=tmp1-8;
			if(tmp1*220+tmp2==1979)fldrepcnt=enc[encc++];
		}
		}else{
		fldrepcnt--;
		}
		tmp=enc[encc++];tmp+=enc[encc++]*64;tmp+=enc[encc++]*4096;
		ap[e*3+0]=tmp%8;tmp=Math.floor(tmp/8);
		ap[e*3+1]=tmp%4;tmp=Math.floor(tmp/4);
		ap[e*3+2]=tmp%220;tmp=Math.floor(tmp/220);
		au[e]=tmp%2;tmp=Math.floor(tmp/2);
		am[e]=tmp%2;tmp=Math.floor(tmp/2);
		if(e===0){ct=tmp%2;}tmp=Math.floor(tmp/2);
		acflg=tmp%2;tmp=Math.floor(tmp/2);
		ac[e]=(e>0)?ac[e-1]:'';
		cmstrrep=ac[e];
		ac[e]=cmstrrep;
		ad[e]=tmp%2;tmp=Math.floor(tmp/2);
		if(acflg){
		tmp=enc[encc++];
		tmp+=enc[encc++]*64;
		tmplen=(tmp%4096);tmp=Math.floor(tmp/4096);
		tmpstr='';
		for(i=0;i<tmplen;i+=4){
			tmp=enc[encc++];
			tmp+=enc[encc++]*64;
			tmp+=enc[encc++]*4096;
			tmp+=enc[encc++]*262144;
			tmp+=enc[encc++]*16777216;
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
		}
		ac[e]=unescape(tmpstr.substring(0,tmplen));
		}
		for(i=0;i<220;i++)af[(e+1)*220+i]=af[e*220+i];
		if(!ad[e]){
		if(ap[e*3+0]>0){
			for(j=0;j<4;j++)af[(e+1)*220+ap[e*3+2]+b[ap[e*3+0]*32+ap[e*3+1]*8+j*2+1]*10+b[ap[e*3+0]*32+ap[e*3+1]*8+j*2]-11]=ap[e*3+0];
		}
		for(i=20,k=20;k>=0;k--){
			chk=0;for(j=0;j<10;j++)chk+=(af[(e+1)*220+k*10+j]>0);
			if(chk<10){
			for(j=0;j<10;j++)af[(e+1)*220+i*10+j]=af[(e+1)*220+k*10+j];
			i--;
			}
		}
		for(;i>=0;i--)for(j=0;j<10;j++)af[(e+1)*220+i*10+j]=0;
		if(au[e]){for(i=0;i<210;i++)af[(e+1)*220+i]=af[(e+1)*220+i+10];for(i=210;i<220;i++)af[(e+1)*220+i]=0;}
		if(am[e])for(i=0;i<21;i++)for(j=0;j<5;j++){tmp=af[(e+1)*220+i*10+j];af[(e+1)*220+i*10+j]=af[(e+1)*220+i*10+9-j];af[(e+1)*220+i*10+9-j]=tmp;}
		}
	}

	// Now for the actual tedige function.
	/* While I'm at it here's the variable that we are interested in:
	(foreword: fumen always initialize 2000 'frames' even if there's no data in it)
	= af - playfield =
		Always contains 440220 elements (2000 * 22 * 10). It stores the playfield matrix (size 22 x 10), each matrix appended to the other. So the first 220 elements is the first matrix, the 220 next the second one, etc. There's an extra line at the top and at the bottom

	= ap - active piece =
		Always contains 6000 elements. The data is stored in triplet in the 1D array: first is the piece type (0-6, see the translation table), then its orientation (0-3), then its position.

	= ac - comments =
		2000 elements, one for each playfield. Contains the comment string.

	= e - # of playfield =
		the amount of playfield, apparently

	=ct - rotation system=
		0 = ars
		1 = srs
	*/

	aDiag.remove_all_playfields(); // let's nuke everything first

	for (z=0;z<e;z++)
	{
		aDiag.new_frame(); // add a new frame for each playfield

		// rotation system
		if (ct == 1)
		{
		  aDiag.frames[z].RS = 'SRS';
		}
		else
		{
		  aDiag.frames[z].RS = 'ARS';
		}

		// playfield
		for(var i=0;i<10;i++)
		{
			for (j=0;j<20;j++)
			{
			aDiag.frames[z].modify(i,j,fconvert(af[(z*220+10*(j+1)+i)])); // get the right case in the big array (z: frame; j: line; i: column; we dump the first and last line, hence the j+1 and why we go from 0 to 20 and not to 22)
			}
		}

		// active piece
		// fumen models a 3x3 (4x4 for I) bounding box, centered on the coordinate ( for the 4x4 box it's the center upper left case that define the center)

			aDiag.frames[z].activePieceType = fconvert(ap[3*z+0]);
			if (aDiag.frames[z].activePieceType)
			{
				aDiag.frames[z].activePieceOrientation = oconvert(ap[3*z+1],ct,aDiag.frames[z].activePieceType);
				var activePositions = pconvert(ap[3*z+2],aDiag.frames[z].activePieceOrientation,ct);
				
				aDiag.frames[z].activePiecePositionX = parseInt(parseInt(activePositions[0])+parseInt(fumenoffsetx(aDiag.frames[z].activePieceType,aDiag.frames[z].activePieceOrientation,aDiag.frames[z].RS)));				
				aDiag.frames[z].activePiecePositionY = parseInt(parseInt(activePositions[1])+parseInt(fumenoffsety(aDiag.frames[z].activePieceType,aDiag.frames[z].activePieceOrientation,aDiag.frames[z].RS)));
				//console.log(aDiag.frames[z].activePiecePositionX);
				}

		// comments
		if(ac[z])
		{
		aDiag.frames[z].comment = ac[z]; // todo: maybe a should do a method to change the comment ? (so it can be displayed ?)
		}

	}

	aDiag.remove_current_frame(); // dunno why it bugs when I try for (z=0;z<e-1;z++), so I do this instead; draw is in remove_current_frame, so I don't need to call it

	function pconvert(input,orientation,system){
		var x;
		var y;
			x = input%10;
			y = parseInt((input - x - 10)/10,10);
		return [x,y];
	}

	function fconvert(input){
		var out;
		switch(input){
			case 0:
				out = '';
			break;
			case 1:
				out = 'I';
			break;
			case 2:
				out = 'L';
			break;
			case 3:
				out = 'O';
			break;
			case 4:
				out = 'Z';
			break;
			case 5:
				out = 'T';
			break;
			case 6:
				out = 'J';
			break;
			case 7:
				out = 'S';
			break;
			case 8:
				out = 'G';
			break;
			default:
			break;
		}
		return out;
	}

	function oconvert(input, rs,piecetype)
	{
	/* cw i ccw u
	ars
	all piece follows: i ccw u cw
	*/
	var output;
	if (rs) // srs
	{
		switch(input) // SRS: some manual adjustement are needed because fumen SRS model isn't the same as tedige
		{
			case 0 :
			output =  'u';
			if (piecetype == 'I' || piecetype == 'Z')
			{
			  output =  'i';
			}

			break;
			case 1 :
			output =  'cw';
			if (piecetype == 'S')
			{
			  output =  'ccw';
			}

			break;
			case 2 :
			output = 'i';
			if (piecetype == 'Z' || piecetype == 'S')
			{
			  output =  'u';
			}

			break;
			case 3 :
			output = 'ccw';
			if (piecetype == 'Z')
			{
			  output =  'ccw';
			}
			break;
		}

	}
	else // ars
	{
		switch(input)
		{
			case 0 :
			output =  'i';
			break;
			case 1 :
			output =  'ccw';
			break;
			case 2 :
			output = 'u';
			break;
			case 3 :
			output = 'cw';
			break;
		}
	}
	
	return output;
	}
	function fumenoffsetx(piecetype,pieceorientation){
		var output = "0";
		if(aDiag.frames[z].RS == "ARS")
		{
		switch(piecetype)
			{
			case "I":
				switch(pieceorientation)
				{
					case "cw": output = "-1"; break;
					case "ccw": output = "-1"; break;
				}
			}
		}
		else{ //if srs
		switch(piecetype)
			{
			case "Z":
				switch(pieceorientation)
				{
					case "ccw": output = "1"; break;
				}
			
			case "I":
				switch(pieceorientation)
				{
					case "cw": output = "-1"; break;
				}
			}
		
		}
		return output;
	}
	
	function fumenoffsety(piecetype,pieceorientation){
		var output = "0";
		if(aDiag.frames[z].RS == "ARS")
		{
			switch(piecetype)
				{
				case "J":
					switch(pieceorientation)
					{
						case "u": output = "-1"; break;
					}
				case "T":
					switch(pieceorientation)
					{
						case "u": output = "-1"; break;
					}
				case "L":
					switch(pieceorientation)
					{
						case "u": output = "-1"; break;
					}
				}
		}
		else{
			switch(piecetype)
				{
				case "Z":
					switch(pieceorientation)
					{
						case "i": output = "1"; break;
					}

				}
		
		}
		return output;
	}

	});




	/* ---------------------------------------------------------------------------- */
	/* --------------------------- ANIMATION MANAGEMENT  -------------------------- */
	/* ---------------------------------------------------------------------------- */


	var _frames = 16.6666667;
	//aDiag.load('M~MyFoobarIsRich_A~Jgkccw_I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_+A~e_I~Tahagbd~Shgje~Ebfbhif+I~Zaa+I~Zab+I~Zac+I~Zad+I~Zae+I~Zaf+I~Zag+I~Zai+I~Zba+I~Zbb+I~Zbc+I~Zbd+I~Zbe+I~Zbf+I~Zbg+I~Zbi+I~Zda+I~Zdb+I~Zdc+I~Zdd+I~Zde+I~Zdf+I~Zdg+I~Zdi+I~Zea+I~Zeb+I~Zec+I~Zed+I~Zee+I~Zef+I~Zeg+I~Zei+I~Zfa+I~Zfb+I~Zfc+I~Zfd+I~Zfe+I~Zff');

	// aDiag.painter.drawWhitePixel(aDiag.frames[aDiag.current_frame].playfield);
	//aDiag.painter.drawLocalWhitePixel(aDiag.frames[aDiag.current_frame].playfield,5,6)

	$('#pf-cmd_playpause').click(function(){
	//console.log('tick');
		var i = aDiag.current_frame;
		var len = aDiag.frames.length;
		if(aDiag.playing)
		{
			aDiag.playing = false;
			$('#pf-cmd_playpause').attr('value','▷');
		}
		else{
			aDiag.playing = true;
			$('#pf-cmd_playpause').attr('value','∥');
		}
		var counter = 0;
		function render(){
			// TODO: does not escape properly when we press pause
			//console.log('rendering... @'+i+' - '+counter);

			if (i < len && aDiag.playing)
				{
					if(counter < aDiag.frames[aDiag.current_frame].duration)
					{
						aDiag.goto_frame(i);
						counter++;
					}
					else{
					counter = 0;
					i++;
					}

					//interval = aDiag.frames[aDiag.current_frame].duration;
					requestAnimationFrame(render);
				}
				else if($('#pf-loop').is(':checked'))
				{
					i = 0;
					requestAnimationFrame(render);
				}
		}
		render();
	/* v2
		var i = aDiag.current_frame;
		var len = aDiag.frames.length;
		var interval = '';
		if(playpause)
		{
			playpause = false;
		}
		else{
			playpause = true;
		}

		function draw() {
			setTimeout(function() {
				var myReq = window.requestAnimationFrame(draw);
				console.log('req');
			if (i < len && playpause)
				{
					aDiag.goto_frame(i);
					interval = aDiag.frames[aDiag.current_frame].duration;
					i++;
				}
				else if($('#pf-loop').is(':checked'))
				{
					i = 0;
				}

				else
				{
				window.cancelAnimationFrame(myReq);
				console.log('release');
				}

			}, interval);
		}
		draw();
	*/

	/* v1
		aDiag.first_frame();
		var i = 0;
		advance();
		function advance(){
			//console.log('Doki '+i);
			if(i<aDiag.frames.length-1)
			{
				aDiag.next_frame();
				setTimeout(advance,1*_frames);
				i++;
			} // change and see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			else
			{
				console.log('Finished !');
			}
		}

		*/
	});


	/* ------------------------------------------------------------------------- */
	/* --------------------------- PANEL MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */


	var $mainutilities = $('#main-utilities');
	var $tabdeco = $('#tab-deco');
	var $tabtetramino = $('#tab-tetramino');

	var $tetraminopanel = $('#tetramino-panel');
	var $decorationspanel = $('#panel-decorations');
	var $tools = $('#tools');

	//var $actionspanel = $("#panel-actions");

	$('body').mousedown(function(){IS_CLICKING = true;}).mouseup(function(){IS_CLICKING = false;});

	function setpanelfalse(){
		DECORATION_PANEL = false;
		TETRAMINO_PANEL = false;
	}

	function primary_hideallpanelexcept(exception){
		if (exception !='decorationspanel')
			{$decorationspanel.fadeOut(200);}
		if (exception !='tetraminopanel')
			{$tetraminopanel.fadeOut(200);}
	}

	$tabdeco.click(function(){
		primary_hideallpanelexcept('decorationspanel');
		setpanelfalse();
		DECORATION_PANEL = true;
		$decorationspanel.delay(200).fadeIn();
		$mainutilities.removeClass().addClass('border-deco');
	});

	$tabtetramino.mousedown(function(){
		primary_hideallpanelexcept('tetraminopanel');
		setpanelfalse();
		TETRAMINO_PANEL = true;
		$tetraminopanel.delay(200).fadeIn();
		$mainutilities.removeClass().addClass('border-tetramino');
	});
	
	function settoolfalse(){
		TOOL_DROP = false;
		TOOL_FILL = false;
		TOOL_RECTANGULAR = false;
		TOOL_PENCIL = false;
		TOOL_ERASER = false;
		$drop.removeClass('pressed');
		$fill.removeClass('pressed');
		$pencil.removeClass('pressed');
		$eraser.removeClass('pressed');
	}

	var $drop = $('#button-drop');
	$drop.mousedown(function(){
		if (TOOL_DROP) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_DROP = true;
			$drop.addClass('pressed');

		}
	});

	var $fill = $('#button-paint-bucket');
	$fill.mousedown(function(){
		if (TOOL_FILL) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_FILL = true;
			$fill.addClass('pressed');

		}
	});

	var $pencil = $('#button-pencil');
	$pencil.mousedown(function(){
		if (TOOL_PENCIL) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_PENCIL = true;
			$pencil.addClass('pressed');

		}
	});

	var $eraser = $('#button-eraser');
	$eraser.mousedown(function(){
		if (TOOL_ERASER) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_ERASER = true;
			$eraser.addClass('pressed');

		}
	});


	var $eraserdeco = $('#button-eraser-deco');
	$eraserdeco.mousedown(function(){
		if (TOOL_ERASER_DECO) {
			TOOL_ERASER_DECO = false;
			$eraserdeco.removeClass('pressed');
		}
		else
		{
			TOOL_ERASER_DECO = true;
			$eraserdeco.addClass('pressed');

		}
	});

var $highlightdeco = $('#checkbox-highlight-decoration');
	$highlightdeco.click(function(){
		if ($highlightdeco.is(':checked')) {
			$highlightdeco.attr('checked',true);
			$('#pf-decoPin').fadeIn();
		}
		else
		{
			$highlightdeco.attr('checked',false);
			$('#pf-decoPin').fadeOut();
		}
	});


//////// Properties panel////////////
	/*
	$('#next1-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(1,$('#next1-select').val());
	});

	$('#next2-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(2,$('#next2-select').val());
	});

	$('#next3-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(3,$('#next3-select').val());
	});

	$('#hold-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(0,$('#hold-select').val());
	});
	*/
	


	$('#export-image-frame-button').click(function(){
		if ($('#export-image-play-sign').is(':checked'))
		{
			aDiag.painter.exportImage('play');
		}
		else{
			aDiag.painter.exportImage();
		}

		$('#export-gif').attr('style','display: none');
		$('#pf-export').attr('style','display: block');
	});

	$('#export-image-diagram-button').click(function(){
		aDiag.getGIF();
		$('#export-gif').attr('style','display: block');
		$('#pf-export').attr('style','display: none');
	});


	$('#thumbnail-mode').click(function(){
		$('#thumbnails-container').toggleClass('timeline table');
	});

	$('#thumbnails').on("click",".thumbnail",function(){
		//console.log("thumbnclik");
		if (aDiag.current_frame+1 == aDiag.frames.length) {
			$('#thumbnail-'+parseInt(aDiag.current_frame+1)).toggleClass('selected');
			old_diagram_goto_frame.call(aDiag,$(this).attr('id').split('-')[1]-1);
			$('#thumbnail-'+parseInt(aDiag.frames[aDiag.current_frame].id)).toggleClass('selected');
		}
		else
		{
			$('#thumbnail-'+parseInt(aDiag.frames[aDiag.current_frame].id)).toggleClass('selected');
			old_diagram_goto_frame.call(aDiag,$(this).attr('id').split('-')[1]-1);
			$('#thumbnail-'+parseInt(aDiag.frames[aDiag.current_frame].id)).toggleClass('selected');

		}

		
			//$('#thumbnail-'+parseInt(aDiag.frames[aDiag.current_frame+1].id)).toggleClass('selected');

		//aDiag.goto_frame($(this).attr('id').split('-')[1]-1,10);
	});

	/*$('.thumbnail').click(function(){
		/* */
	//});*/

	/* ---------------------------------------------------------------------------- */
	/* --------------------------- SAVE/LOAD MANAGEMENT  -------------------------- */
	/* ---------------------------------------------------------------------------- */


	$('.export-button').click(function(){

		var export_string = '';
		var destination = $(this).attr('id');
		if($('input[name=export-type]:checked').val() == 'All')
		{
			export_string = 'all-'+aDiag.flate_encode(aDiag.print()); // compressed
			//export_string = 'all-'+aDiag.print(); // not compressed
			console.log('all-'+aDiag.print());
			// export_string = aDiag.print();
		}

		if($('input[name=export-type]:checked').val() == 'Current')
		{
			export_string = 'current-'+aDiag.flate_encode(aDiag.frames[aDiag.current_frame].print()); // compressed
			//export_string = 'current-'+aDiag.frames[aDiag.current_frame].print(); // not compressed
		}
		switch(destination)
		{
			case 'export-forum-button':
				$('#export').html('[tedige]v01-'+export_string+'[/tedige]').select();
			break;
			case 'export-custom-button':
				var findtedige = /%TEDIGE%/; // find %TEDIGE%
				var custom_tag = $('#export-custom-string').val();
				custom_tag = custom_tag.replace(findtedige, 'v01-'+export_string);
				$('#export').html(custom_tag).select();
			break;
			case 'export-editor-button':
				$('#export').html(window.location.href.split('?')[0]+'?v01-'+export_string).select(); // the extra split is here to make sure you don't catch a leftover from a previous URL import.
			break;
			case 'export-viewer-button':
				var URL = window.location.href.split('?')[0].split('/');
				URL.pop();
				$('#export').html(URL.join('/')+'/viewer.html?v01-'+export_string).select();
			break;
		}


	});
	// textarea selection http://stackoverflow.com/questions/5797539/jquery-select-all-text-from-a-textarea#5797700
	$('#export').focus(function() {
		var $this = $(this);
		$this.select();
		// Work around Chrome's little problem
		$this.mouseup(function() {
			// Prevent further mouseup intervention
			$this.unbind('mouseup');
			return false;
		});
	});

/*
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="tedige.html";
				$("#export").html(output+"#"+this.print());
	*/
	var regforum = /\[tedige\](.+)\[\/tedige\]/; // matches everything between [tedige] and [/tedige]
	var regURL = /v01.+/; // matches everything after v01
	$('#import-button').click(function(){
		var bigstr = $('#import').val();

		// find the position
		resultforum = regforum.exec(bigstr); // todo: make that work ?
		resultURL = regURL.exec(bigstr);
		//console.log(resultforum.split('-'));
		var littlestr;
		if (resultURL)
		{
			littlestr = resultURL[0].split('-'); //split till the end
		}

		if (resultforum)
		{
			littlestr = resultforum[0].split('-');
			littlestr[2] = littlestr[2].split('[')[0];
		}

		switch(littlestr[1])
		{
			case 'all':
				aDiag.load(aDiag.flate_decode(littlestr[2])); // compressed
				//aDiag.load(littlestr[2]); // not compressed
				aDiag.frames[aDiag.current_frame].draw();
			break;

			case 'current':
				aDiag.frames[aDiag.current_frame].load(aDiag.flate_decode(littlestr[2]));	 // compressed
				//aDiag.frames[aDiag.current_frame].load(littlestr[2]); //not compressed
				aDiag.frames[aDiag.current_frame].draw();
			break;
		}


		/*switch($('#import-export-wrapper input[type=radio][name=export-type]:checked').attr('value')){

			case 'All':
				if(result)
				{
					aDiag.load(xflatedecode(result[1]));
					// aDiag.load(result[1]);
				}
				else
				{
					aDiag.load(xflatedecode(bigstr));
					// aDiag.load(bigstr);
				}
				break;

			case 'Current':
				if(result)
				{
					aDiag.frames[aDiag.current_frame].load(xflatedecode(result[1]));
					// aDiag.frames[aDiag.current_frame].load(result[1]);
				}
				else
				{
					aDiag.frames[aDiag.current_frame].load(xflatedecode(bigstr));
					// // aDiag.frames[aDiag.current_frame].load(bigstr);
				}
				break;
			break;

		}*/

	});

	/*
	$('.preview-table').click(function(){
		console.log('barabar');
		//$(this).parent().parent().parent().parent().parent().addClass('pressed');
	});
	*/

	


	var KEYBOARD_MODE = true;

	$('#keyboard-control').click(function(){
		if ($('#keyboard-control').attr('checked')) {
			KEYBOARD_MODE = true;
			$('#keyboard-control-list').slideDown();
		}
		else
			{
				KEYBOARD_MODE = false
				$('#keyboard-control-list').slideUp();
			}
	});

	KeyboardJS.on('left', function() {
		if (KEYBOARD_MODE) {
			$('#pf-cmd_prev').click();			
		};
	});
	KeyboardJS.on('shift + a', function() {
		if (KEYBOARD_MODE) {
			$('#pf-cmd_prev').click();
		};
	});
	KeyboardJS.on('right', function() {
		if (KEYBOARD_MODE) {
			$('#pf-cmd_next').click();
		};
	});
	KeyboardJS.on('shift + d', function() {
		if (KEYBOARD_MODE) {
			$('#pf-cmd_next').click();
		};
	});
	KeyboardJS.on('w', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_move_up').mousedown();
		};
	});

	KeyboardJS.on('a', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_move_left').mousedown();
		};
	});

	KeyboardJS.on('s', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_move_down').mousedown();
		};
	});

	KeyboardJS.on('d', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_move_right').mousedown();
		};
	});

	KeyboardJS.on('h', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_ccw').mousedown();
		};
	});

	KeyboardJS.on('j', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_cw').mousedown();
		};
	});

	KeyboardJS.on('k', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_paint').mousedown();
		};
	});

	KeyboardJS.on('l', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_lock').mousedown();
		};
	});

	KeyboardJS.on('shift + w', function() {
		if (KEYBOARD_MODE) {
			$('#cmd_drop').mousedown();
		};
	});

	KeyboardJS.on('shift + s', function() {
		if (KEYBOARD_MODE && aDiag.frames[aDiag.current_frame].activePieceType) {
			$('#cmd_drop').mousedown();
			$('#pf-cmd_clone').mousedown();
			$('#cmd_opacity_flash').mousedown();
			$('#pf-cmd_clone').mousedown();
			$('#cmd_lock').mousedown();
		};
	});

	KeyboardJS.on('shift + h', function() {
		if (KEYBOARD_MODE) {
			cyclePalette("up");
		};
	});

	KeyboardJS.on('shift + J', function() {
		if (KEYBOARD_MODE) {
			cyclePalette("down");
		};
	});

	function cyclePalette(order)
	{
		var extract = $('input[type=radio][name="select"]:checked').attr('value'),
			piecePresent = false;
		$('#'+extract+'-cell').toggleClass('pressed');
		if (aDiag.frames[aDiag.current_frame].activePieceType) {piecePresent = true;}
		else
			{aDiag.frames[aDiag.current_frame].activePieceOrientation = "i"};
		if (order == "down") {
			switch(extract.charAt(0))
			{
				case 'Z':
					$('#O'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#O'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "O",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'O':
					$('#I'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#I'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "I",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'I':
					$('#T'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#T'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "T",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'T':
					$('#L'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#L'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "L",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'L':
					$('#J'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#J'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "J",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'J':
					$('#S'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#S'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "S",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
					break;
				case 'S':
					$('#Z'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
					$('#Z'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
					break;
					if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																				  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																				  "Z",
																				  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																				  "active",
																				  false);};
			};

		};// end order down
		if (order == "up") 
			{
				switch(extract.charAt(0))
				{
					case 'I':
						$('#O'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#O'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "O",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'T':
						$('#I'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#I'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "I",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'L':
						$('#T'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#T'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "T",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'J':
						$('#L'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#L'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "L",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'S':
						$('#J'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#J'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "J",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'Z':
						$('#S'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#S'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "S",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
						break;
					case 'O':
						$('#Z'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'-cell').toggleClass('pressed');
						$('#Z'+aDiag.frames[aDiag.current_frame].activePieceOrientation+'').attr("checked","checked");
						break;
						if (piecePresent) {aDiag.frames[aDiag.current_frame].addPiece(aDiag.frames[aDiag.current_frame].activePiecePositionX,
																					  aDiag.frames[aDiag.current_frame].activePiecePositionY,
																					  "Z",
																					  aDiag.frames[aDiag.current_frame].activePieceOrientation,
																					  "active",
																					  false);};
				};
			};//end order up
			if (!piecePresent) {aDiag.frames[aDiag.current_frame].activePieceOrientation = ""};
	}

	$('#foobartest').click(function(){
		console.log(aDiag);
		console.log(aDiag.frames[aDiag.current_frame]);
		console.log(aDiag.print());
		//aDiag.painter.generateNewPreviewTable(1);
		//aDiag.frames[aDiag.current_frame].whiteborder = true;
		//aDiag.painter.drawWhiteBorder(aDiag.frames[aDiag.current_frame].playfield);
		//aPainter.highlight(3,4);
		//console.log(aDiag.frames[aDiag.current_frame].comment);
		//console.log(aDiag.flate_decode('bY6xDsIwDEQ/iJkPAIRQKsHQMHWJkthnN1MVmP3tuBESCz7J2717s53mmM52z6839zRZP6aL9XEpWChUuKBI0coEZvgDIFCLQh4WiIgqKVRXWrVR03QI9syUOcPLWqlyRZWqdh1AIThGfnW7MbHTWVh9AjteeUVDkxRca5dS3VzqYSEu+0D8OxDchL8uGDaOcKMwCFsfhGla0gc='));
		// file:///D:/Hoang/TeDiGe/Tetris-Diagram-Generator-2/tedige.html?v01-all-bY6xDsIwDEQ/iJkPAIRQKsHQMHWJkthnN1MVmP3tuBESCz7J2717s53mmM52z6839zRZP6aL9XEpWChUuKBI0coEZvgDIFCLQh4WiIgqKVRXWrVR03QI9syUOcPLWqlyRZWqdh1AIThGfnW7MbHTWVh9AjteeUVDkxRca5dS3VzqYSEu+0D8OxDchL8uGDaOcKMwCFsfhGla0gc=?v01-all-jcw9DoAgDIbhAzl7AHWi0ZAAE0sjxIEVNW49u3+DXzdhKXl52olJqbAT7zz3Ms3rtlQmqS0PUp/DTXd/ygeb676PAnP+ypjSDrMKBcNXLBCLxAKxikQoEUmEXVGRACUgCbArKEJACAkBIUU8EP+nnA==
		//'all-jcw9DoAgDIbhAzl7AHWi0ZAAE0sjxIEVNW49u3+DXzdhKXl52olJqbAT7zz3Ms3rtlQmqS0PUp/DTXd/ygeb676PAnP+ypjSDrMKBcNXLBCLxAKxikQoEUmEXVGRACUgCbArKEJACAkBIUU8EP+nnA=='
	});


}); // end jquery.ready

/*
	var TIMER_MODEL = {
		TGM1: {
			ARE: 30,
			lock: 30,
			separation1: 10,
			separation2: 6,
			separation3: 6,
			separation4: 6
			// 10+6+6+6 = 28; 28 + 1 + 2 = 31
			},
		Master000699:{
			ARE: 25,
			lock: 30,
			separation1: 10,
			separation2: 6,
			separation3: 6,
			separation4: 6
		},
		Master700799:{
			ARE: 16,
			lock: 30,
			separation1: 10,
			separation2: 6,
			separation3: 6,
			separation4: 6
		},
		Master800899:{
			ARE: 12,
			lock: 30,
			separation1: 10,
			separation2: 6,
			separation3: 6,
			separation4: 6
		},
		Master900999:{
			ARE: 12,
			lock: 17,
			separation1: 6,
			separation2: 4,
			separation3: 4,
			separation4: 3
			// 5 + 4 + 3 + 3 = 14
		},
		Master10001099:{
			ARE: 6,
			lock: 17,
			separation1: 6,
			separation2: 4,
			separation3: 4,
			separation4: 3
			// 5 + 4 + 3 + 3 = 14
		},
		Master11001199:{
			ARE: 5,
			lock: 15,
			separation1: 5,
			separation2: 4,
			separation3: 4,
			separation4: 3
			// 4 + 4 + 3 + 3 = 14
		},
		Master12001299:{
			ARE: 4,
			lock: 15,
			separation1: 5,
			separation2: 4,
			separation3: 4,
			separation4: 3
			// 4 + 4 + 3 + 3 = 14
		},
		Death000099:{
			ARE: 16,
			lock: 30,
			separation1: 10,
			separation2: 6,
			separation3: 6,
			separation4: 6
		},
		Death100199:{
			ARE: 12,
			lock: 26,
			separation1: 9,
			separation2: 6,
			separation3: 6,
			separation4: 5
		},
		Death200299:{
			ARE: 12,
			lock: 22,
			separation1: 7,
			separation2: 5,
			separation3: 4,
			separation4: 4
		},
		Death300399:{
			ARE: 6,
			lock: 18,
			separation1: 6,
			separation2: 4,
			separation3: 4,
			separation4: 4
		},
		Death400499:{
			ARE: 5,
			lock: 15,
			separation1: 5,
			separation2: 3,
			separation3: 3,
			separation4: 3
		},
		Death500999:{
			ARE: 4,
			lock: 15,
			separation1: 5,
			separation2: 3,
			separation3: 3,
			separation4: 3
		},
		Shirase000199:{
			ARE: 10,
			lock: 18,
			separation1: 6,
			separation2: 4,
			separation3: 4,
			separation4: 4
		},
		Shirase200299:{
			ARE: 10,
			lock: 17,
			separation1: 6,
			separation2: 4,
			separation3: 4,
			separation4: 3
		},
		Shirase300499:{
			ARE: 4,
			lock: 15,
			separation1: 5,
			separation2: 3,
			separation3: 3,
			separation4: 3
		},
		Shirase500599:{
			ARE: 4,
			lock: 13,
			separation1: 4,
			separation2: 3,
			separation3: 3,
			separation4: 3
		},
		Shirase6001099:{
			ARE: 4,
			lock: 12,
			separation1: 4,
			separation2: 3,
			separation3: 3,
			separation4: 2
		},
		Shirase11001199:{
			ARE: 4,
			lock: 10,
			separation1: 4,
			separation2: 2,
			separation3: 2,
			separation4: 2
		},
		Shirase12001299:{
			ARE: 4,
			lock: 8,
			separation1: 4,
			separation2: 2,
			separation3: 1,
			separation4: 1
		},
		TDSSRS:{
			ARE: 1, // 0 in reality
			lock: 30,
			separation1: 10,
			separation2: 7,
			separation3: 8,
			separation4: 6
		}
	}
*/