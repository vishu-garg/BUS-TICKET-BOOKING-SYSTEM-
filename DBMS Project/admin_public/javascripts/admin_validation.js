// var reslt;
$(document).ready(function(){
$("#form1").submit(function (e) {
    var form=this;
    // alert('1234'); 
    e.preventDefault();
    d={};
    d['id']=document.forms["f1"]["admin_id"].value;
    d['pass']=document.forms["f1"]["admin_password"].value;
    $.ajax({
    type:"POST",
    url:"http://192.168.43.80:6732/check",
    data:JSON.stringify(d),
    contentType: "application/json; charset=utf-8",
    success:
    function(result){
        // alert(result);
        if(result!="WRONG_DETAILS"){form.action='/admin_home/'+result; form.submit();}
        else 
        {
            $("#check_status").html("<h4>Wrong Id or Password!</h4>");
        }
    }});
    // alert(reslt);
});

// var tmp='<%=check%>';
// var ctx = document.getElementById('myChart').getContext('2d');
//         var chart = new Chart(ctx, {
//             // The type of chart we want to create
//             type: 'line',

//             // The data for our dataset
//             data: {
//                 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//                 datasets: [{
//                     label: [tmp],
//                     // backgroundColor: 'rgb(255,0,0)',
//                     borderColor: 'rgb(0,0,0)',
//                     data: [0, 10, 5, 2, 20, 30, 45]
//                 }]
//             },

//             // Configuration options go here
//             options: {}
//         });

});