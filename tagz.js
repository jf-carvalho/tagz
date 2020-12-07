const create_element = (tag, classes, events) => {
	const created_element = document.createElement(tag)

	const _classes = typeof classes == 'string' ? [classes] : classes
	_classes.forEach(class_name => {
		created_element.classList.add(class_name)
	})

	if(events){
	events.forEach(({type, callback}) => {
		created_element.addEventListener(type, callback, true)
	})
	}

	return created_element
}

Element.prototype.copy_style = function(copies, similars, ref){
	copies.forEach(prop => {
		this.style[prop] = window.getComputedStyle(ref).getPropertyValue(prop)
	})

	similars.forEach(props => {		
		this.style[Object.keys(props)[0]] = window.getComputedStyle(ref).getPropertyValue(Object.values(props)[0])
	})
}

Element.prototype.tagz = function(options){

	const wrapper = create_element(
			'div', 
			'tagz-wrapper', 
			[
				{
					'type': 'click', 
					'callback': focusWrapper
				}
			])

	wrapper.copy_style(['border', 'font-size', 'font-family', 'border-radius', 'background', 'padding'], [{'min-height': 'height'}], this)

	const input = create_element(
			'input', 
			['one_bs_to_edit', 'tagz-input'], 
			[
				{
					'type': 'focus', 
					'callback': focusInput
				}
			])

	const text_for_sizing = create_element('div', 'text_for_sizing')

	this.parentElement.insertBefore(wrapper, this)
	wrapper.appendChild(input)
	wrapper.appendChild(this)	
	wrapper.appendChild(text_for_sizing)

	this.style.display = 'none'

	this.parentElement.querySelector('input').addEventListener('keyup', () => key_typed(options), true)

	if(this.value !== ''){
		let val = this.value
		if(val.trim().slice(-1) === ','){
			val = val.trim().slice(0, -1); 
		}
		const values = val.split(',');
		values.forEach(value => {
			createTag(input, value, options)
		})
	}
}

function focusInput(evt){
	this.parentElement.style.outline = getComputedStyle(this).getPropertyValue('outline')
	this.style.outline = 'none'
	evt.stopPropagation()
}

function focusWrapper(){
	this.querySelector('input').focus()
	this.querySelector('input').style.outline = 'none'		
}

function key_typed(options){
	
	const input = event.target
	input.parentElement.querySelector('.text_for_sizing').innerText = input.value

	const width = parseInt(window.getComputedStyle(input.parentElement.querySelector('.text_for_sizing')).getPropertyValue('width').replace('px','')) + 25;
	input.style.width = width + 'px'
	
	if(!isBackspace(event)){
		input.classList.remove('one_bs_to_edit')
	}

	if(isComma(event)){
		const tag = input.value.split(',').slice(0,input.value.split(',').length-1).pop()
		createTag(input, tag, options);

	}else if(isBackspace(event)){
		if(input.classList.contains('one_bs_to_edit')){
			editLastTag(input)
		}

		if(input.value == ''){
			input.classList.add('one_bs_to_edit')
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

function editLastTag(input, all_tags = input.parentElement.parentElement.querySelectorAll('.tagz_tag')){
	const last_tag = all_tags[all_tags.length - 1]

	input.style.width = window.getComputedStyle(last_tag).getPropertyValue('width')
	last_tag.querySelector('a').remove()
	input.value = last_tag.innerText
	last_tag.remove()

	input.classList.remove('one_bs_to_edit')
}

function setTagStyle(tag, input, options){
	const {bg, color} = defaults(options)
	tag.style.cssText = `
						color: ${color}; 
						background-color: ${bg};
						height: ${window.getComputedStyle(input.parentElement.querySelector('input')).getPropertyValue('height')};
						`
}

function createTag(input, tag, options){

	const tag_span = create_element('span', 'tagz_tag')
	tag_span.innerText = tag

	const del_tag = create_element('a', 'del_tag', [{'click': rm_tag}])
	del_tag.innerHTML = '&times;'

	tag_span.append(del_tag)

	input.parentElement.insertBefore(tag_span, input.parentElement.querySelector('input'))
	input.value = ''
	input.classList.add('one_bs_to_edit')
	input.parentElement.querySelector('textarea').value += tag + ','

	setTagStyle(tag_span, input, options)
}

function rm_tag(){
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
}

function defaults(options){
	const {bg, color} = options || {}
	return {
		'bg': bg || '#007BFF',
		'color': color || '#fff'
	}
}