'use strict';

var myPollsController;
(function () {
   var appUrl = window.location.origin;   // TODO: Remove
   var myPollsControllerInstance = new function() {
      var addButton = document.querySelector('.btn-polls-add');
      var $pollsArea = $('#polls-list');
      const pollsAmount = ".polls-amount";
      var apiUrl = appUrl + '/api/polls';
      
      this.delete = function(id, callback) {
         var data = {
            id: id 
         };
         $.ajax(apiUrl, {
            method: "DELETE",
            data:data,
            success: function(data) {
               if ( callback ) { callback(data); }
            }
         });
      }
   
      var updateClickCount = function (data) {
         var clicksObject = JSON.parse(data);
         //clickNbr.innerHTML = clicksObject.clicks;
      }
      
      var renderList = function (polls) {
         $pollsArea.empty();
         $.each(polls, function(index, poll) {
            $pollsArea.append('<div class="poll"><span class="poll-name">' + poll.name + '</span></div>');
         });
         $(pollsAmount).text(polls.length || 0);
      }
      
      var init = function() {
         if ( $('#polls-list').length > 0 ) {
            $.get(apiUrl, {}, renderList);
         }
         
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
               $('#polls-create').hide();
               $('.btn-polls-add').show();
            });
         });
      };
      init();
      myPollsController = this;
   };
})();
