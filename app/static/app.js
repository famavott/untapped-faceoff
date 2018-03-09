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
                localStorage.setItem('userinfo', JSON.stringify(response))
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
            console.log('The beers are here')
            console.log(response)
        },
        error: function(error) {
            console.log(error)
        }
    })
}

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

    $('#user-card').html(table)
};
