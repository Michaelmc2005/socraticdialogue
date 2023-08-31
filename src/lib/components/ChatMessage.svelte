<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string
  </script>
  
  <div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-flex" style="justify-content: {type === 'user' ? 'flex-end' : 'flex-start'};">
	<div class="chat-image avatar">
	  <div class="w-10 rounded-full">
		<img
		  src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'S'}"
		  alt="{type} avatar"
		/>
	  </div>
	</div>
	<div class="chat-header">
	  {type === 'user' ? 'Me' : 'Socratique'}
	</div>
	<div class="chat-bubble {type === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
	  {message}
	</div>
  </div>
  
  <style>
	.chat-bubble-primary {
	  background-color: #7e7e7e ;
	  color: #333;
	  font-size: 1rem;
	}
  
	.chat-bubble-primary-light {
	  background-color: #0f1c1c;
	  color: #fff;
	  font-size: 1rem;
	}
  
	.chat-bubble-secondary {
	  background-color: #152121 ;
	  color: #fff;
	  font-size: 1rem;
	}
  
	.chat-bubble-secondary-light {
	  background-color: #fff;
	  color: #333;
	  font-size: 1rem;
	}
  
	/* Customize the chat header colors */
	.chat-header-primary {
	  color: #fff;
	}
  
	.chat-header-secondary {
	  color: #333;
	}
	@media (max-width: 640px) {

	.chat-bubble-primary {
	  background-color: #CECECF ;
	  color: #333;
	  font-size: 0.75rem;
	  width: auto;
	}
  
	.chat-bubble-primary-light {
	  background-color: #008080;
	  color: #fff;
	  font-size: 0.75rem;
	  width: auto;
	}
  
	.chat-bubble-secondary {
	  background-color: #008080 ;
	  color: #fff;
	  font-size: 0.75rem;
	  width: auto;
	}
  
	.chat-bubble-secondary-light {
	  background-color: #fff;
	  color: #333;
	  font-size: 0.75rem;
	  width: auto;
	}
	}
  </style>
  