function focusInput(evt){
			if(evt.target.classList.contains('tagz_wrapper')){
				evt.target.querySelector('input').focus()
				evt.target.style.outline = window.getComputedStyle(evt.target.querySelector('input')).getPropertyValue('outline')
				evt.target.querySelector('input').style.outline = 'none'			
			}
		}

		window.onload = () => {
			const tagz_elements = document.getElementsByClassName('tagz')

			Array.from(tagz_elements).forEach(tagz => {

				const wrapper = document.createElement('div');
				wrapper.classList.add('tagz_wrapper')

				wrapper.addEventListener('click', focusInput, true)

				wrapper.style.cssText = `	min-height: ${window.getComputedStyle(tagz).getPropertyValue('height')};
											width: 100%;
											border: ${window.getComputedStyle(tagz).getPropertyValue('border')};
											font-size: ${window.getComputedStyle(tagz).getPropertyValue('font-size')};
											font-family: ${window.getComputedStyle(tagz).getPropertyValue('font-family')};
											border-radius: ${window.getComputedStyle(tagz).getPropertyValue('border-radius')};
											background: ${window.getComputedStyle(tagz).getPropertyValue('background')};
											padding: ${window.getComputedStyle(tagz).getPropertyValue('padding')};
											display: flex;
											flex-wrap: wrap;
											align-items: flex-start;
											align-content: baseline;
											`
				
				tagz.parentElement.insertBefore(wrapper, tagz);

				const input = document.createElement('input')
				input.classList.add('one_bs_to_edit')
				input.style.cssText = `	border: none;
										background: none;
										width: 20px;
										`
				input.addEventListener('focus', function(){
					this.parentElement.style.outline = getComputedStyle(this).getPropertyValue('outline')
					this.style.outline = 'none'
				}, true)
				wrapper.appendChild(input)

				wrapper.appendChild(tagz)

				const text_for_sizing = document.createElement('div')
				text_for_sizing.classList.add('text_for_sizing')
				text_for_sizing.style.cssText = `visibility: hidden; 
												 position: absolute`
				wrapper.appendChild(text_for_sizing)

				tagz.style.display = 'none'

				tagz.parentElement.querySelector('input').addEventListener('keyup', key_typed, true)

				if(tagz.value !== ''){
					const values = tagz.value.split(',');
					values.forEach(value => {
						createTag(input, value)
					})
				}

			})
		}

		function key_typed(evt){

				evt.target.parentElement.querySelector('.text_for_sizing').innerText = this.value
				const width = parseInt(window.getComputedStyle(evt.target.parentElement.querySelector('.text_for_sizing')).getPropertyValue('width').replace('px','')) + 25;
				this.style.width = width + 'px'
				
				if(!isBackspace(evt)){
					evt.target.classList.remove('one_bs_to_edit')
				}

			if(isComma(evt)){
				const tag = this.value.split(',').slice(0,this.value.split(',').length-1).pop()

				createTag(evt, tag);

			}else if(isBackspace(evt)){
				if(evt.target.classList.contains('one_bs_to_edit')){
					const all_tags = this.parentElement.parentElement.querySelectorAll('.tagz_tag')
					evt.target.style.width = window.getComputedStyle(all_tags[all_tags.length - 1]).getPropertyValue('width')
					all_tags[all_tags.length - 1].querySelector('a').remove()
					evt.target.value = all_tags[all_tags.length - 1].innerText
					all_tags[all_tags.length - 1].remove()
					evt.target.classList.remove('one_bs_to_edit')
				}

				if(evt.target.value == ''){
					evt.target.classList.add('one_bs_to_edit')
				}
			}
		}

		function isComma(evt_key){
			if (evt_key.key === ',' || evt_key.keyCode === 188) {
				return true
			}
			return false			
		}

		function isBackspace(evt_key){
			if (evt_key.key === 'Backspace' || evt_key.keyCode === 8) {
				return true
			}
			return false
		}

		function createTag(evt, tag){

			if(evt instanceof HTMLElement){
				evt.target = evt;
			}

			const tag_span = document.createElement('span')
			tag_span.innerText = tag
			tag_span.classList.add('tagz_tag')

			const color = evt.target.parentElement.querySelector('.tagz').getAttribute('tagz-color') !== null ? evt.target.parentElement.querySelector('.tagz').getAttribute('tagz-color') : '#fff'

			const bg = evt.target.parentElement.querySelector('.tagz').getAttribute('tagz-bg') !== null ? evt.target.parentElement.querySelector('.tagz').getAttribute('tagz-bg') : '#007BFF'

			tag_span.style.cssText = `	color: ${color}; 
										background-color: ${bg};
										margin-right: 3px;
										margin-bottom: 3px;
										padding: 1.5px 0 1.5px 10px;
										height: ${window.getComputedStyle(evt.target.parentElement.querySelector('input')).getPropertyValue('height')};
										display: flex;
										justify-content: center;
										align-items: center;
										border-radius: 3px;`

			const del_tag = document.createElement('a')
			del_tag.innerHTML = '&times;'
			del_tag.style.cssText = `
									dispaly: block;
									font-size: 16px;
									color: #fff;
									padding: 0 6px;
									cursor: pointer;
									`
			del_tag.addEventListener('click', function(){
				const clicked_tag = this.parentElement;
				const all_tags = this.parentElement.parentElement.querySelectorAll('.tagz_tag')
				for (var i = all_tags.length - 1; i >= 0; i--) {
					if(all_tags[i] === clicked_tag){
						const value_arr = this.parentElement.parentElement.querySelector('.tagz').value.split(',')
						const rm_value = value_arr.splice(i,1)
						this.parentElement.parentElement.querySelector('.tagz').value = value_arr.join(',')
					}
				}
				this.parentElement.remove()
			}, true)
			tag_span.append(del_tag)

			evt.target.parentElement.insertBefore(tag_span, evt.target.parentElement.querySelector('input'))
			evt.target.value = ''
			evt.target.classList.add('one_bs_to_edit')
			evt.target.parentElement.querySelector('textarea').value += tag + ','
		}