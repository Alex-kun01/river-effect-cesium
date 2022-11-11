<!--
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-09-14 09:58:23
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-09-14 14:18:37
 * @FilePath: \box-selection\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

#### 地图框选

```javascript
import boxSelect from '@/utils/defaultUtils/select/boxSelection';
```

##### 开始框选的方法

- **startSelect(things, callBack)**

参数

| Name     | Type     | Argument | Description                                         |
| -------- | -------- | -------- | --------------------------------------------------- |
| things   | array    | Required | 参与框选的物体列表，需要 thingjs query 出来的类数组 |
| callBack | function | Required | 框选得到的物体列表                                  |

##### 结束框选的方法

- **endSelect()**
