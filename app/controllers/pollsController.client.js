'use strict';

(function () {

   var addButton = document.querySelector('.btn-polls-add');
   var deleteButton = document.querySelector('.btn-polls-delete');
   var $pollsArea = $('#pollsList');
   const pollsAmount = ".polls-amount";
   var apiUrl = appUrl + '/api/polls';

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      //clickNbr.innerHTML = clicksObject.clicks;
   }
   
   function renderList(data) {
      var polls = JSON.parse(data);
      $pollsArea.empty();
      $.each(polls, function(index, poll) {
         $pollsArea.append('<div class="poll"><span class="poll-name">' + poll.name + '</span></div>');
      });
      $(pollsAmount).text(polls.length || 0);
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, renderList));

   /*addButton.addEventListener('click', function () {
      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);*/
   
   $('.btn-polls-add').click(function() {
      $(this).hide();
      $('#polls-create').show();
   });
   
   $('#polls-create').submit(function(evt) {
      evt.preventDefault();
      
      var data = {
         name: $('#polls-create-name').val(),
         options: []
      };
      
      $('.polls-create-option').each(function(ind, el) {
         data.options.push($(el).val());
      });
      
      $.post(apiUrl, data, function(data) {
         console.log(data);
         $('#polls-create').hide();
         $('.btn-polls-add').show();
      });
   });

   deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
