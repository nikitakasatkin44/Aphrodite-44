// $('#msg1').submit(function (event) {
//     event.preventDefault();
//
//     const data = $('#msg1 input').val();
//     console.log(data);
// });

let pageCount = 1;

$('#nextPage').onclick(function() {
    pageCount = pageCount + 1;
});

$('#prevPage').onclick(function () {
    pageCount = pageCount - 1
});