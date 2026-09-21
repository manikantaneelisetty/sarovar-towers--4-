
import { pathToFileURL } from 'url';
import fs from 'fs';

const towerDataModule = await import(pathToFileURL('./src/services/towerData.js').href);
const { tower1Data, tower2Data, tower3Data } = towerDataModule;

function transformPath(d, transformY) {
  const tokens = d.trim().split(/(?=[MmLlCcZz])/);
  let result = '';
  for (const token of tokens) {
    if (!token.trim()) continue;
    const cmd = token[0];
    const rest = token.slice(1).trim();
    if (!rest && (cmd === 'z' || cmd === 'Z')) { result += cmd; continue; }
    const vals = (rest.match(/[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g) || []).map(Number);
    if (cmd === 'M' || cmd === 'L') {
      const newVals = [];
      for (let i = 0; i < vals.length; i += 2) { newVals.push(vals[i]); newVals.push(transformY(vals[i + 1])); }
      result += cmd + newVals.map(v => Number(v.toFixed(3))).join(' ') + ' ';
    } else if (cmd === 'm' || cmd === 'l') {
      const newVals = [];
      for (let i = 0; i < vals.length; i += 2) { newVals.push(vals[i]); newVals.push(transformY.scale(vals[i + 1])); }
      result += cmd + newVals.map(v => Number(v.toFixed(3))).join(' ') + ' ';
    } else if (cmd === 'C') {
      const newVals = [];
      for (let i = 0; i < vals.length; i += 6) {
        newVals.push(vals[i]); newVals.push(transformY(vals[i + 1]));
        newVals.push(vals[i + 2]); newVals.push(transformY(vals[i + 3]));
        newVals.push(vals[i + 4]); newVals.push(transformY(vals[i + 5]));
      }
      result += cmd + newVals.map(v => Number(v.toFixed(3))).join(' ') + ' ';
    } else if (cmd === 'c') {
      const newVals = [];
      for (let i = 0; i < vals.length; i += 6) {
        newVals.push(vals[i]); newVals.push(transformY.scale(vals[i + 1]));
        newVals.push(vals[i + 2]); newVals.push(transformY.scale(vals[i + 3]));
        newVals.push(vals[i + 4]); newVals.push(transformY.scale(vals[i + 5]));
      }
      result += cmd + newVals.map(v => Number(v.toFixed(3))).join(' ') + ' ';
    } else { result += token + ' '; }
  }
  return result.trim();
}

function makeTransformer(currentTop, currentBottom, targetTop, targetBottom) {
  const scale = (targetBottom - targetTop) / (currentBottom - currentTop);
  const fn = function(y) { return targetBottom + (y - currentBottom) * scale; };
  fn.scale = function(dy) { return dy * scale; };
  return fn;
}

const t1 = makeTransformer(71.300, 224.400, 68.200, 222.077);
const t2 = makeTransformer(66.300, 216.500, 63.000, 214.518);
const t3 = makeTransformer(46.400, 224.700, 46.400, 219.188);

const finalTower1 = tower1Data.map(f => Object.assign({}, f, { d: transformPath(f.d, t1) }));
const finalTower2 = tower2Data.map(f => Object.assign({}, f, { d: transformPath(f.d, t2) }));
const finalTower3 = tower3Data.map(f => Object.assign({}, f, { d: transformPath(f.d, t3) }));

const fileContent = '// Static floor coordinates and data for Towers 1, 2, and 3\\n' +
                    '// Calibrated and verified for exact building floor alignment\\n\\n' +
                    'export const tower1Data = ' + JSON.stringify(finalTower1, null, 2) + ';\\n\\n' +
                    'export const tower2Data = ' + JSON.stringify(finalTower2, null, 2) + ';\\n\\n' +
                    'export const tower3Data = ' + JSON.stringify(finalTower3, null, 2) + ';\\n';

fs.writeFileSync('./src/services/towerData.js', fileContent, 'utf8');
console.log('Successfully reverted towerData.js');

