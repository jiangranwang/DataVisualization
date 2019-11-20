import './d3.js'
import './d3-tip.js'

/**
 * Constructor to create a margin for SVG, html document,
 * and any other display object.
 *
 * @param {Number} top the top margin by pixel
 * @param {Number} bottom the bottom margin by pixel
 * @param {Number} left the left margin by pixel
 * @param {Number} right the right margin by pixel
 */
class Margin {
  constructor (top, bottom, left, right) {
    this.top = top
    this.bottom = bottom
    this.left = left
    this.right = right
  }
}

/**
 * Margin info for mapSVG.
 */
const mapSVGMargin = new Margin(50, 50, 50, 50)

/**
 * Margin info for chartSVG.
 */
const chartSVGMargin = new Margin(50, 50, 60, 40)

/**
 * Margin-included height for both SVG canvas.
 */
const height = 720

/**
 * Margin-included width for both SVG canvas.
 */
const width = 1368

/**
 * How much space would mapSVG taken.
 */
const widthRatio = 0.6

/**
 * Margin-excluded width of the map SVG canvas.
 */
const mapSVGWidth = width * widthRatio - mapSVGMargin.left - mapSVGMargin.right

/**
 * Margin-excluded width of the chart SVG canvas.
 */
const chartSVGWidth = width * (1 - widthRatio) - chartSVGMargin.left - chartSVGMargin.right

/**
 * Margin-excluded height of the chart SVG canvas.
 */
const chartSVGHeight = height - chartSVGMargin.top - chartSVGMargin.bottom

/**
 * The colour to denote 0 students.
 */
const startColour = '#eff4ff'

/**
 * The colour to denote the highest number of students.
 */
const endColour = '#001f63'

/**
 * An integer array storing all the available year.
 * Will be modified and **sorted** when the data is imported.
 */
var allYear = []

/**
 * An string array storing all the state name.
 * Will be modified and **sorted** when the data is imported.
 */
var allStateName = []

/**
 * Highest number of incoming students.
 * Will be changed throughout the operation.
 */
var highestIncomingStudent = 0

/**
 * Constant for transforming students number to corresponding colour.
 * If the student number is higher than this, another colour scheme would be applied.
 * Used in @function studentNumberToColour
 */
const incomingStudentThreshold = 5000

/**
 * A color scale for the number of students.
 * Used in @function studentNumberToColour
 */
const studentColourScale = d3.scaleLog()
  .base(10)
  .domain([1, incomingStudentThreshold])
  .range([startColour, endColour])

/**
 * A ratio scale for the number of students.
 * Used in @function drawMap
 */
const studentRatioScale = d3.scaleLog()
  .base(10)
  .domain([1, incomingStudentThreshold])
  .range([0, 1])

/**
 * A function to transform number of students to colour.
 * @param {Number} number number of students.
 */
var studentNumberToColour = function (number) {
  if (number < incomingStudentThreshold) {
    return studentColourScale(number)
  }
  return 'red'
}

/**
 * Year variable that record the scrollbar input.
 * drawMap() should respond to this variables.
 */
var yearPrev = 0

d3.csv('data-modified.csv').then(function (data) {
  /* parse the year and the total number of incoming student from string to integer */
  /* push all the available year in the year array */
  /* push all the state name in the stateName array */
  data.forEach(element => {
    element.Year = parseInt(element.Year)
    element.Total = parseInt(element.Total)
    if (!allStateName.includes(element.State.replace(/[^a-zA-Z]/g, ''))) {
      allStateName.push(element.State.replace(/[^a-zA-Z]/g, ''))
    }
    if (!allYear.includes(element.Year)) {
      allYear.push(element.Year)
    }
    if (element.Total > highestIncomingStudent) {
      highestIncomingStudent = element.Total
    }
  })
  allYear.sort()
  allStateName.sort()

  d3.select('#visualisation')
    .append('svg')
    .attr('id', 'mapSVGFramework')
    .attr('width', mapSVGWidth + mapSVGMargin.left + mapSVGMargin.right)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + mapSVGMargin.left + ',' + mapSVGMargin.top + ')')
    .attr('id', 'mapSVG')

  d3.select('#visualisation')
    .append('svg')
    .attr('id', 'chartSVGFramework')
    .attr('width', chartSVGWidth + chartSVGMargin.left + chartSVGMargin.right)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + chartSVGMargin.left + ',' + chartSVGMargin.top + ')')
    .attr('id', 'chartSVG')

  initialiseMap()
  drawScrollBar(data)
  initialiseChart(data)
  gitHubInfo()
})

/**
 * a helper function to put basic elements on the mapSVG.
 */
function initialiseMap () {
  var mapSVG = d3.select('#mapSVG')

  var legendPosX = 100
  var legendPosY = 600
  var defs = mapSVG.append('defs')

  var linearGradient = defs.append('linearGradient').attr('id', 'linear-gradient')
  linearGradient
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%')
  var stops = [{ offset: 0, color: startColour }]
  for (var i = 100; i <= 1500; i += 100) {
    stops.push({ offset: studentRatioScale(i), color: studentColourScale(i) })
  }
  linearGradient.selectAll('stop')
    .data(stops)
    .enter().append('stop')
    .attr('offset', function (d, i) { return d.offset })
    .attr('stop-color', function (d) { return d.color })
  mapSVG.append('rect')
    .attr('x', legendPosX)
    .attr('y', legendPosY)
    .attr('width', 300)
    .attr('height', 20)
    .style('fill', 'url(#linear-gradient)')
  mapSVG.append('text')
    .attr('x', legendPosX)
    .attr('y', legendPosY + 35)
    .text('0')
  mapSVG.append('text')
    .attr('x', legendPosX + 280)
    .attr('y', legendPosY + 35)
    .text('1500 Students')
  mapSVG.append('text')
    .attr('x', legendPosX + studentRatioScale(10) * 280)
    .attr('y', legendPosY + 35)
    .text('10')
  mapSVG.append('text')
    .attr('x', legendPosX + studentRatioScale(50) * 280)
    .attr('y', legendPosY + 35)
    .text('50')
  mapSVG.append('text')
    .attr('x', legendPosX + studentRatioScale(200) * 280)
    .attr('y', legendPosY + 35)
    .text('200')
  mapSVG.append('text')
    .attr('x', legendPosX + studentRatioScale(1000) * 280)
    .attr('y', legendPosY + 35)
    .text('1000')
  mapSVG.append('rect')
    .attr('x', legendPosX + 125)
    .attr('y', legendPosY - 50)
    .attr('width', 50)
    .attr('height', 20)
    .style('fill', 'red')
  mapSVG.append('text')
    .attr('x', legendPosX + 100)
    .attr('y', legendPosY - 15)
    .text('30000 Students')
}

/**
* The main function to append map onto the svg we created
* @param {Number} currYear the year we would like to display on the map
* @param {Array} data the array of data that we would like to visualise
*/
function drawMap (currYear, data) {
  var svg = d3.select('#mapSVG')
  var projection = d3.geoAlbersUsa()
    .scale([mapSVGWidth])

  var path = d3.geoPath()
    .projection(projection)

  var mapTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html((d) => {
      return "<div style='text-align: center;margin-left:auto; margin-right:auto;'><big>" + d.properties.name + '<br><small><br>' +
                  "<div class='row' style='text-align: center; margin-left:auto; margin-right:auto;'>" +
                  "<div class='col-6' style='border-right: 1px solid white;'>" +
                    '<span style="font-size: 22px;">' + currYear + '</span><br>' +
                    '<span style="font-size: 15px; text-align: center;">year</span><br>' +
                  '</div>' +
                  "<div class='col-6'>" +
                    '<span style="font-size: 22px;"><u>' + d.properties.total + '</u></span><br>' +
                    '<span style="font-size: 15px;">students</span><br>' +
                  '</div>'
    })
  svg.call(mapTip)

  d3.json('us-states.json').then(function (json) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].Year !== currYear) { continue }
      var dataState = data[i].State
      var dataTotal = data[i].Total
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name
        if (jsonState === dataState) {
          json.features[j].properties.total = dataTotal
          break
        }
      }
    }
    var graph = svg.selectAll('path')
      .data(json.features)
    graph.enter()
      .append('path')
      .merge(graph)
      .attr('d', path)
      .style('stroke', 'white')
      .style('stroke-width', '1')
      .style('fill', function (d) {
        var value = d.properties.total
        return studentNumberToColour(value)
      })
      .attr('opacity', 1)
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('opacity', 0.7)
        mapTip.show(d)
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('opacity', 1)
        mapTip.hide(d)
      })
      .on('click', function (d) {
        changeVisibility(d.properties.name.replace(/[^a-zA-Z]/g, ''))
      })
      .exit().remove()
  })
};

/**
 * the main function to append scroll bar onto svg
 * @param {Array} data the data we would like to visualise
 */
function drawScrollBar (data) {
  var svg = d3.select('#mapSVG')

  var x = d3.scaleLinear()
    .domain([allYear[0], allYear[allYear.length - 1]])
    .range([0, mapSVGWidth])
    .clamp(true)

  var slider = svg.append('g')
    .attr('class', 'slider')
  // .attr("transform", "translate(" + 50 + "," + mapSVGHeight/10 + ")");
  // No need to translate the slider anymore as it goes straight under #mapSVG instead of #mapSVGFramework
  // which is already transformed by default

  slider.append('line')
    .attr('class', 'track')
    .attr('x1', x.range()[0])
    .attr('x2', x.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)) })
    .attr('class', 'track-inset')
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)) })
    .attr('class', 'track-overlay')
    .call(d3.drag()
      .on('start.interrupt', function () { slider.interrupt() })
      .on('start drag', function () {
        if (d3.event.y > 15) {
          return
        }
        hue(x.invert(d3.event.x))
      })
    )

  slider.insert('g', '.track-overlay')
    .attr('class', 'ticks')
    .attr('transform', 'translate(0,' + 1 + ')')
    .selectAll('text')
    .data(x.ticks(19))
    .enter().append('text')
    .attr('x', x)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text(function (d) { return d })

  var handle = slider.insert('circle', '.track-overlay')
    .attr('class', 'handle')
    .attr('r', 9)

  slider.transition() // Gratuitous intro!
    .duration(1000)
    .tween('hue', hue(allYear[0]))

  function hue (h) {
    const year = Math.round(h)
    handle.attr('cx', x(year))
    if (year !== yearPrev) {
      yearPrev = year
      drawMap(year, data)
      dashedGrid(year)
    }
  }
}

/**
 * Radius of each dot.
 */
const dotRadius = 3

/**
 * a helper function to put basic elements on the chartSVG.
 * @param {Array} data the array of data that we would like to visualise
 */
function initialiseChart (data) {
  var svg = d3.select('#chartSVG')

  /* ---------- Scales and Axis ---------- */
  var yearScale = d3.scaleLinear()
    .domain([allYear[0], allYear[allYear.length - 1]])
    .range([0, chartSVGWidth])
  var xAxis = d3.axisBottom()
    .scale(yearScale)
  var totalStudentScale = d3.scaleLog()
    .base(10)
    .domain([1, highestIncomingStudent])
    .range([chartSVGHeight, 0])
  var yAxis = d3.axisLeft().scale(totalStudentScale).ticks(100).tickFormat(d3.format(',.2r'))
  svg.append('g')
    .attr('transform', 'translate(0' + ',' + chartSVGHeight + ')')
    .call(xAxis)
  svg.append('g')
    .call(yAxis)

  /* ---------- Dashed line on chart ---------- */
  d3.select('#chartSVG').append('line')
    .attr('id', 'dashedLine')
    .attr('stroke-width', 0.5)
    .attr('stroke', 'black')
    .attr('opacity', 0.4)
    .attr('x1', yearScale(allYear[0]))
    .attr('x2', yearScale(allYear[0]))
    .attr('y1', 0)
    .attr('y2', chartSVGHeight)

  /* ---------- Tip for each dots ---------- */
  var dotTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html((d) => {
      return "<div style='text-align: center;margin-left:auto; margin-right:auto;'><big>" + d.State + '<br><small><br>' +
                  "<div class='row' style='text-align: center; margin-left:auto; margin-right:auto;'>" +
                  "<div class='col-6' style='border-right: 1px solid white;'>" +
                    '<span style="font-size: 22px;">' + d.Year + '</span><br>' +
                    '<span style="font-size: 15px; text-align: center;">year</span><br>' +
                  '</div>' +
                  "<div class='col-6'>" +
                    '<span style="font-size: 22px;"><u>' + d.Total + '</u></span><br>' +
                    '<span style="font-size: 15px;">students</span><br>' +
                  '</div>'
    })
  svg.call(dotTip)

  /* ---------- Axis Caption ---------- */
  var chartTitleGroup = svg.append('g').attr('id', 'chartTitle')
  var xTitleTransform = chartSVGHeight + 40
  chartTitleGroup.append('text')
    .text('Year')
    .attr('transform', 'translate(' + chartSVGWidth / 2 + ',' + xTitleTransform + ')')
  chartTitleGroup.append('text')
    .text('Number of Incoming Students in log 10')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + -50 + ',' + chartSVGHeight / 2 + ')' + 'rotate(90)')

  /* ---------- Group Creation for Chart Elements ---------- */
  allStateName.forEach(stateName => {
    svg.append('g').attr('id', stateName).style('Visibility', 'hidden')
  })

  /* ---------- Append Elements on SVG ---------- */
  for (let i = 0; i < data.length; i++) {
    d3.select('#' + data[i].State.replace(/[^a-zA-Z]/g, ''))
      .append('circle')
      .attr('cx', yearScale(data[i].Year))
      .attr('cy', totalStudentScale(data[i].Total))
      .attr('r', dotRadius)
      .attr('fill', 'white')
      .attr('stroke', studentNumberToColour(data[i].Total))
      .attr('id', data[i].Year + ' ' + data[i].State)
      .on('mouseover', () => {
        dotTip.show(data[i])
      })
      .on('mouseout', () => {
        dotTip.hide(data[i])
      })
      .on('click', () => {
        changeVisibility(data[i].State.replace(/[^a-zA-Z]/g, ''))
        dotTip.hide(data[i])
      })
    if (i < data.length - 1 && data[i].State === data[i + 1].State) {
      d3.select('#' + data[i].State.replace(/[^a-zA-Z]/g, ''))
        .append('line')
        .on('click', () => {
          changeVisibility(data[i].State.replace(/[^a-zA-Z]/g, ''))
        })
        .attr('stroke-width', 2)
        .attr('x1', yearScale(data[i].Year))
        .attr('x2', yearScale(data[i + 1].Year))
        .attr('y1', totalStudentScale(data[i].Total))
        .attr('y2', totalStudentScale(data[i + 1].Total))
        .attr('stroke', studentNumberToColour(data[i].Total))
    }
  }
}

/**
 * A helper function to change certain state's chart visibility.
 * @param {String} state the name of the state to have its visibility changed
 */
function changeVisibility (state) {
  if (!allStateName.includes(state)) {
    alert('Invalid operation!')
  }
  // equivalent to document.getElementById if we select element by d3 with .node() command
  var group = d3.select('#' + state.replace(/[^a-zA-Z]/g, '')).node()
  group.style.visibility = group.style.visibility === 'visible' ? 'hidden' : 'visible'
}

/**
 * A helper function to update the position of the dashed grid.
 * @param {Number} year the current year we are displaying
 */
function dashedGrid (year) {
  var yearScale = d3.scaleLinear()
    .domain([allYear[0], allYear[allYear.length - 1]])
    .range([0, chartSVGWidth])
  d3.select('#dashedLine')
    .transition()
    .attr('x1', yearScale(year))
    .attr('x2', yearScale(year))
}

function gitHubInfo () {
  const httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', 'https://api.github.com/repos/int0thewind/CS-296-Project-2/commits')
  httpRequest.onload = () => {
    if (httpRequest.status === 200) {
      const req = JSON.parse(httpRequest.responseText)
      const commit = req[0].sha
      const link = req[0].html_url
      const date = req[0].commit.committer.date.substring(0, 10)
      document.getElementById('github').innerHTML = `Latest Commit: <a href=${link} target="_blank">${commit.substring(0, 6)}</a> on ${date}`
    } else {
      document.getElementById('github').innerHTML = 'Fail to get latest GitHub commit info.'
    }
  }
  httpRequest.send()
}
