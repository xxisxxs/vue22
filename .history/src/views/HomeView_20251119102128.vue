<template>
  <div style="width: 100%;height: 100%;position: relative;">
    <div id="map" style="width: 100%; height: 100%"></div>
    <div style="position: absolute;left: 40px;bottom: 40px;z-index: 99999;">
      <el-popover placement="bottom" width="200" trigger="click">
        <div>
          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">敷设方式</div>
          <el-checkbox-group class="map-checkbox" v-model="fsfsChecked">
            <el-checkbox v-for="item in fsfsList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>

          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">电压等级(KV)</div>
          <el-checkbox-group class="map-checkbox" v-model="dydjChecked">
            <el-checkbox v-for="item in dydjList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>

        </div>
        <el-button slot="reference">AAA</el-button>
      </el-popover>

      <el-popover placement="bottom" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <div>
          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">通道设施</div>
          <el-checkbox-group class="map-checkbox" v-model="tdsbChecked">
            <el-checkbox v-for="item in tdsbList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button slot="reference">通道设施</el-button>
      </el-popover>

      <el-popover placement="bottom" width="200" trigger="click">
        <div>
          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">电缆设施</div>
          <el-checkbox-group class="map-checkbox" v-model="dlssChecked">
            <el-checkbox v-for="item in dlssList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button slot="reference">电缆设施</el-button>
      </el-popover>
      <el-popover placement="bottom" width="200" trigger="click">
        <div>
          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">电缆等级</div>
          <el-checkbox-group class="map-checkbox" v-model="zycdChecked">
            <el-checkbox v-for="item in zycdList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button slot="reference">电缆等级</el-button>
      </el-popover>
       <el-popover placement="bottom" width="200" trigger="click">
        <div>
          <div style="height: 24px;font-size: 18px;margin-bottom: 8px;">通道等级</div>
          <el-checkbox-group class="map-checkbox" v-model="zycdChannelChecked">
            <el-checkbox v-for="item in zycdChannelList" :key="item.value" :label="item.value">
              <div style="display: flex;justify-content: space-between;height: 16px;"><span>{{ item.key }}</span><span
                  :style="{ width: '30px', 'background-color': item.color }"></span></div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button slot="reference">通道等级</el-button>
      </el-popover>
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
import { genMap, filterCableLine, filterChannelLine  } from './mapUtils'
export default {
  name: 'HomeView',
  components: {
  },
  beforeCreate() {
    this.map = null
  },
  data() {
    return {
      fsfsList: [{ key: '隧道', value: '106', color: 'red' }, { key: '电缆沟', value: '105', color: 'green' }, { key: '排管', value: '107', color: 'blue' }, //敷设方式
      { key: '拖拉管', value: '109', color: 'red' }, { key: '顶管', value: '108', color: 'green' }, { key: '综合管廊', value: '104', color: 'blue' }
      ],
      fsfsChecked: [],
      dydjList: [{ key: '35', value: '25', color: 'red' }, { key: '110', value: '26', color: 'green' }, { key: '220', value: '27', color: 'blue' }],  //电压等级
      dydjChecked: ['25', '26', '27'],

      tdsbList: [
        { key: '转弯井', value: '转弯井', color: 'red' }, { key: '直通井', value: '直通井', color: 'green' },
        { key: '转角井', value: '转角井', color: 'red' }, { key: '接头井', value: '接头井', color: 'green' },
        { key: '三通井', value: '三通井', color: 'red' }, { key: '四通井', value: '四通井', color: 'green' },
        { key: '余缆井', value: '余缆井', color: 'red' }, { key: '直线井', value: '直线井', color: 'green' }
      ], 
      tdsbChecked: ['转弯井', '直通井', '转角井', '接头井', '三通井', '四通井', '余缆井', '直线井',],
      //电缆设施

      dlssList: [{ key: '电缆终端', value: '电缆终端', color: 'red' }, { key: '中间接头', value: '中间接头', color: 'green' }], //电缆设施
      dlssChecked: ['电缆终端', '中间接头'],

      zycdList: [{ key: '一级', value: '55', color: 'red' }, { key: '二级', value: '56', color: 'green' }, { key: '三级', value: '57', color: 'green' }], //电缆等级(重要程度)
      zycdChecked: ['55', '56', '57'],
      zycdChannelList: [{ key: '一级', value: '456', color: 'red' }, { key: '二级', value: '457', color: 'green' }, { key: '三级', value: '458', color: 'green' }],
      zycdChannelChecked:['456', '457', '458']

    }
  },
  mounted() {
    genMap('map').then((map) => this.map = map)
  },
  computed: {
    filterCableCondition() {
      return { dydj: this.dydjChecked, zycd: this.zycdChecked }
    },
    filterChannelCondition() {
      return { fslx: this.fsfsChecked, zycd: this.zycdChannelChecked }
    }
  },
  watch: {
    filterCableCondition() {
      filterCableLine(this.map, this.filterCableCondition)
    },
    filterChannelCondition() {
      filterChannelLine(this.map, this.filterChannelCondition)
    }

  }
}
</script>
<style lang="less">
.map-checkbox {
  display: flex;
  flex-flow: column nowrap;

  .el-checkbox {
    margin-bottom: 12px;
    margin-right: 30px !important;
  }

  .el-checkbox__label {
    width: 100%;
  }
}
</style>
