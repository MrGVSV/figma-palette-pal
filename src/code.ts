figma.showUI(__html__, {height: 500})

figma.ui.onmessage = msg => {
  if(msg.type === 'set-color') {
    figma.clientStorage.setAsync(msg.data.name, msg.data.color);
  } else if(msg.type === 'get-color') {
    figma.clientStorage.getAsync(msg.data.name).then(res => figma.ui.postMessage({type: 'get-color-res', data: {name: msg.data.name, color: res}}))
  } else if(msg.type === 'set-swatches') {
    figma.clientStorage.setAsync('swatches', msg.data);
  } else if(msg.type === 'get-swatches') {
    figma.clientStorage.getAsync('swatches').then(res => figma.ui.postMessage({type: 'get-swatches-res', data: res}));
  } else if(msg.type === 'set-bg') {
    figma.clientStorage.setAsync('bg', msg.data);
  } else if(msg.type === 'get-bg') {
    figma.clientStorage.getAsync('bg').then(res => figma.ui.postMessage({type: 'get-bg-res', data: res}));
  } else if(msg.type === 'set-shift') {
    figma.clientStorage.setAsync('shift', msg.data);
  } else if(msg.type === 'get-shift') {
    figma.clientStorage.getAsync('shift').then(res => figma.ui.postMessage({type: 'get-shift-res', data: res}));
  }
}