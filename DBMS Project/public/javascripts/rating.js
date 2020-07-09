// require('jquery-3.5.1.min.js');
var $stars;
var rating;
var bus_id;
jQuery(document).ready(function ($) {
//   // Custom whitelist to allow for using HTML tags in popover content
//   var myDefaultWhiteList = $.fn.tooltip.Constructor.Default.whiteList
//   myDefaultWhiteList.textarea = [];
//   myDefaultWhiteList.button = [];
var tg1=document.getElementById('frm1');
    if(tg1!=null)
    tg1.remove();
  $stars = $('.rate-popover');
  $stars.on('mouseover', function () {
    var index = $(this).attr('data-index');
    // console.log(cnt);
    // console.log('in popover');
    markStarsAsActive(index);
  });

  function markStarsAsActive(index) {
    unmarkActive();
    rating=(index-'0')+1;
    console.log(index);
    for (var i = 0; i <= index; i++) {
      switch (index) {
        case '0':
          $($stars.get(i)).addClass('oneStar');
          break;
        case '1':
          $($stars.get(i)).addClass('twoStars');
          break;
        case '2':
          $($stars.get(i)).addClass('threeStars');
          break;
        case '3':
          $($stars.get(i)).addClass('fourStars');
          break;
        case '4':
          $($stars.get(i)).addClass('fiveStars');
          break;
      }
    }
  }

  function unmarkActive() {
    $stars.removeClass('oneStar twoStars threeStars fourStars fiveStars');
  }

  $stars.on('click', function () {
    // console.log(bus_id);
    var tg1=document.getElementById('frm1');
    if(tg1!=null)
    tg1.remove();

    var f=document.createElement("form");
    f.setAttribute('method','post');
    f.setAttribute('action','/thanks');
    f.setAttribute('id','frm1');

    var tg=document.getElementById('modalbody');
    tg.appendChild(f);
    
    var f1=document.getElementById('frm1');

    f1.innerHTML+='<input type="hidden" name="stars" value='+rating+'>';
    f1.innerHTML+='<input type="hidden" name="bus_id" value='+bus_id+'>';
    f1.innerHTML+='<textarea type="text" style="font-size: 0.78rem" class="md-textarea form-control py-0" placeholder="Write us what can we improve" rows="3"></textarea><button id="voteSubmitButton" type="submit" class="btn btn-sm btn-primary">Submit!</button>';



    // $('#frm1').append('<input type="hidden" name="stars" value='+rating+'>');
    $stars.popover('hide');
  });

  // Submit, you can add some extra custom code here
  // ex. to send the information to the server
  $('#rateMe').on('click', '#voteSubmitButton', function () {
    $stars.popover('hide');
  });

  // Cancel, just close the popover

//   $('.rate-popover').popover({
//     // Append popover to #rateMe to allow handling form inside the popover
//     container: '#rateMe',
//     // Custom content for popover
//     content: `<form id="frm1" class="my-0 py-0" action="/thanks"> <textarea type="text" style="font-size: 0.78rem" class="md-textarea form-control py-0" placeholder="Write us what can we improve" rows="3"></textarea><button id="voteSubmitButton" type="submit" class="btn btn-sm btn-primary">Submit!</button> <button id="closePopoverButton" class="btn btn-flat btn-sm">Close</button>  </form>`
//   });
//   $('.rate-popover').tooltip();

});

function func1(bus_id1, user_id)
{
  bus_id=bus_id1;
  
  // document.getElementById('exampleModalLabel').innerHTML='Ratin';
  return;
}

function func2()
{
  var tg=document.getElementById('frm1');
  if(tg!=null)
  tg.remove();
  // cnt=0; 
  // console.log(cnt);   
  // unmarkActive();
  var tg9=document.getElementsByClassName('rate-popover');
  // console.log(tg9);
  for(i=0;i<5;i++)
  {tg9[i].classList.remove('oneStar');
  tg9[i].classList.remove('twoStars');
  tg9[i].classList.remove('threeStars');
  tg9[i].classList.remove('fourStars');
  tg9[i].classList.remove('fiveStars');}
  // console.log('in func2');
  return;
}
