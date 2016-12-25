'use strict';

var myPollsController;
(function () {
   var appUrl = window.location.origin;   // TODO: Remove
   var myPollsControllerInstance = new function() {
      var addButton = document.querySelector('.btn-polls-add');
      var $pollsArea = $('#polls-list');
      const pollsAmount = ".polls-amount";
      var apiUrl = appUrl + '/api/polls';
      var apiVoteUrl = apiUrl + '/options';
      
      this.addPollOption = function() {
         $('#polls-create .polls-options').append(designPollOption());
      }
      
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
      
      var designPoll = function(poll) {
         var html = '<div class="poll"><span class="poll-name"><a ' +
           'href="'+appUrl+'/polls/'+poll._id+'">' + poll.name + '</a></span>';
         if ( poll.options && poll.options.length ) {
            html += '<span class="pull-right" style="color: lightgrey;">'+
              poll.options.length+' options</span>';
         }
         html += '</div>';
         return html;
      }
      var designPollOption = function() {
         return '<label>Option: <input class="form-control polls-create-option" name="option" type="text" placeholder="How is the option called?" /></label>';
      }
      
      var updateClickCount = function (data) {
         var clicksObject = JSON.parse(data);
         //clickNbr.innerHTML = clicksObject.clicks;
      }
      
      var renderList = function (polls) {
         $pollsArea.empty();
         $.each(polls, function(index, poll) {
            $pollsArea.append(designPoll(poll));
         });
         $(pollsAmount).text(polls.length || 0);
      }
      
      var init = function() {
         if ( $('#polls-list').length > 0 ) {
            $.get(apiUrl, {}, renderList);
         }
         
         $('.btn-polls-add').click(function() {
            $(this).hide();
            myPollsController.addPollOption();
            $('#polls-create').show();
         });
         
         $('.polls-options-more').click(function(evt) {
            evt.preventDefault();
            myPollsController.addPollOption();
         });
         
         $('#polls-create').submit(function(evt) {
            evt.preventDefault();
            
            var data = {
               name: $('#polls-create-name').val(),
               options: []
            };
            
            $('.polls-create-option').each(function(ind, el) {
               var val = $(el).val();
               if ( val==="" ) { next; }
               data.options.push(val);
            });
            
            $.post(apiUrl, data, function(result) {
               $('#polls-create').hide().find('.polls-create-option').remove();
               $('.btn-polls-add').show();
               $('.polls-list').prepend(designPoll(data));
            });
         });
         
         $('.poll-vote').submit(function(evt) {
            evt.preventDefault();
            
            var pollId = $('.poll-id').attr('data-poll-id');
            var choice = $('.poll-vote input:radio:checked').val();
            
            $.post(apiVoteUrl, {pollId: pollId, optionId: choice}, function(result) {
               window.location.reload();
            });
         });
      };
      init();
      myPollsController = this;
   };
})();
