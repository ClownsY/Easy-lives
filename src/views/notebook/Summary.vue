<template>
  <div class="body">
    <div class="all">
      <div class="title"><span>总计</span></div>
      <div class="both">
        <div ref="allChartOne" class="allChartOne"></div>
        <div ref="allChartTwo" class="allChartTwo"></div>
      </div>
    </div>
    <el-divider />
    <div class="part">
      <div class="study">
        <div class="title"><span>学习区</span></div>
        <div ref="studyChart" class="studyChart"></div>
      </div>
      <el-divider />
      <div class="live">
        <div class="title">生活区</div>
        <div ref="liveChart" class="liveChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import record from '@/api/record.js'
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const allChartOne = ref(null)
    const allChartTwo = ref(null)
    const studyChart = ref(null)
    const liveChart = ref(null)
    let onePic = []
    let twoPic = []
    let threePic = []
    let xaxis = []
    let yaxisTodo = []
    let yaxisDone = []
    //获取后端的数据
    onMounted(async () => {
      try {
        let res = await record.summary()
        onePic = res.result.onePic
        twoPic = res.result.twoPic
        threePic = res.result.threePic
        xaxis = res.result.xaxis
        yaxisTodo = res.result.yaxisTodo
        yaxisDone = res.result.yaxisDone
      } catch (err) {
        console.error(err)
      }
      study()
      allFirst()
      allSecond()
      live()
    })

    //学习方面的饼图
    function study() {
      var myChart = echarts.init(studyChart.value)
      var option
      option = {
        color: ['#c6dfc8', '#f8df70'],
        title: {
          text: 'study',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['已做', '未做']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: threePic,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }

    //生活方面的饼图
    function live() {
      var myChart = echarts.init(liveChart.value)
      var option
      option = {
        color: ['#f34718', '#a4aca7'],
        title: {
          text: 'life',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['已做', '未做']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: twoPic,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }

    //未做和已做的饼图
    function allFirst() {
      var myChart = echarts.init(allChartOne.value)
      var option
      option = {
        color: ['#5698c3', '#2c9678'],
        title: {
          text: 'latest Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['已做', '未做']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: onePic,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }

    //未做和已做的折线图
    function allSecond() {
      var myChart = echarts.init(allChartTwo.value)
      var option
      option = {
        xAxis: {
          type: 'category',
          data: xaxis
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 10
        },
        series: [
          {
            data: yaxisTodo,
            type: 'line',
            smooth: true
          },
          {
            data: yaxisDone,
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option)
    }
    return {
      allChartOne,
      liveChart,
      studyChart,
      allChartTwo
    }
  }
}
</script>

<style lang="scss" scoped>
.studyChart,
.liveChart,
.allChartOne,
.allChartTwo {
  width: 500px;
  height: 500px;
}
.both {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
}
.part {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-around;
  align-items: center;
}
.part .title {
  width: 500px;
  font-size: 40px;
  padding: 20px 0px;
  text-align: center;
}
.part {
  margin-top: 50px;
}
.all .title {
  width: 100%;
  font-size: 40px;
  padding: 20px 0px;
  text-align: center;
}
</style>
