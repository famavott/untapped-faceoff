'use strict';

$(document).ready(function() {
    $('#main-btn').click(function(event) {
        let username = $('#username-search').val()

        $.ajax({
            type: 'POST',
            url: '/userinfo',
            dataType: 'json',
            data: {'username': JSON.stringify(username)},
            success: function(response) {
                console.log(response)
                localStorage.setItem('userinfo', JSON.stringify(response))
                $('.welcome').hide()
                renderBasicInfo()
                getAllBeers(username)
            },
            error: function(error) {
                console.log(error)
            }
        })
    })
});

function getAllBeers(username) {
    $.ajax({
        type: 'POST',
        url: '/userbeers',
        dataType: 'json',
        data: {'username': JSON.stringify(username)},
        success: function(response) {
          console.log(response)
          $('.graph-area').removeClass('hidden')
          getRatingData(response)
          ratingChart.update()
          getDayData(response)
          dayChart.update()
        },
        error: function(error) {
            console.log(error)
        }
    })
};

function renderBasicInfo() {
    let userinfo = JSON.parse(localStorage['userinfo'])
    let username = userinfo['username']
    let location = userinfo['location']
    let totalBeers = userinfo['total_beers']
    let totalCheckins = userinfo['total_checkins']
    let friends = userinfo['friends']
    let avatar = userinfo['avatar']
    let badge = userinfo['recent_badge']
    let badgeDate = userinfo['recent_date']

    let table = `<table class="user-table">
            <tbody>
              <tr>
                <th scope="row">${username}</th>
                <td><img src=${avatar} alt="Avatar photo"></td>
              </tr>
              <tr>
                <th scope="row">Location:</th>
                <td>${location}</td>
              </tr>
              <tr>
                <th scope="row">Friends:</th>
                <td>${friends}</td>
              </tr>
              <tr>
                <th scope="row">Total Unique Beers:</th>
                <td>${totalBeers}</td>
              </tr>
              <tr>
                <th scope="row">Total Check-ins:</th>
                <td>${totalCheckins}</td>
              </tr>
              <tr>
                <th scope="row">Most Recent Badge:</th>
                <td>${badge}</td>
              </tr>
              <tr>
                <th scope="row">Most Recent Badge Date:</th>
                <td>${badgeDate}</td>
              </tr>
            </tbody>
          </table>`

    let welcome = `<a class="nav-link" href="#">Welcome, ${username}!</a>`
    $('.nav-link').hide()
    $('.nav-item').html(welcome)
    $('#user-card').html(table)
};

const beer_ratings = []
const ratings_count = []
const colors = []
const borderColors = []

function getRatingData(response) {
  let ratings = []
  let counts = {}
  for(let item in response) {
    ratings.push(response[item].rating_score)
  }
  for(let i = 0; i < ratings.length; i++) {
    if(!counts.hasOwnProperty(ratings[i])) {
      counts[ratings[i]] = 1
    } else {
      counts[ratings[i]]++
    }
  }
  for(let [key, value] of Object.entries(counts)) {
    beer_ratings.push(parseFloat(key))
    ratings_count.push(value)
  }
  for(let i = 0; i < ratings_count.length; i++) {
    let color = `rgba(${randomColorFactor()}, ${randomColorFactor()}, ${randomColorFactor()}, 0.4)`
    colors.push(color)
    borderColors.push(color)
  }
  console.log(getRatingAverage(ratings))
};

function getRatingAverage(allRatings) {
  let sum = 0
  for(var i =0; i < allRatings.length; i++) {
    sum += allRatings[i]
  }
  return Math.round((sum/allRatings.length) * 100) / 100
};

const beer_styles = []
const styles_count = []

let ctx = $("#rating-graph");
let ratingChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: beer_ratings,
        datasets: [{
            label: '# of Reviews by Rating',
            data: ratings_count,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

const week_days = []
const days_count = []

function getDayData(response) {
  let dayStr = []
  let counts = {
                "Mon": 0,
                "Tue": 0,
                "Wed": 0,
                "Thu": 0,
                "Fri": 0,
                "Sat": 0,
                "Sun": 0
  }

  for (let item in response) {
    dayStr.push(response[item].first_created_at.slice(0, 3))
  }
  for(let i = 0; i < dayStr.length; i++) {
    counts[dayStr[i]]++
  }
  for(let [key, value] of Object.entries(counts)) {
    week_days.push(key)
    days_count.push(value)
  }
};

let ctx2 = $("#day-graph");
let dayChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: week_days,
        datasets: [{
            label: 'Check-ins by Day',
            data: days_count,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

 function getStyleData(response) {
  let styles = []
  let counts = {}
  for(let item in response) {
    styles.push(response[item].beer.beer_style)
  }
  for(let i = 0; i < styles.length; i++) {
    if (!counts.hasOwnProperty(styles[i])) {
      counts[styles[i]] = 1
    } else {
      counts[styles[i]]++
    }
  }
  for(let [key, value] of Object.entries(counts)) {
    beer_styles.push(key)
    styles_count.push(value)
  }
  console.log(beer_styles)
  console.log(styles_count)
};

let randomColorFactor = function() {
  return (Math.round(Math.random() * 255))
};