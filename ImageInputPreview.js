/**
 * Image input preview handler
 */
class ImageInputPreview{
	constructor(target, parameters){
		/**
		 * Base input
		 * @type {Element}
		 */
		this.input = target instanceof Element ? target : document.querySelector(target);

		/**
		 * Has the input changed ?
		 * @type {Boolean}
		 */
		this.changed = false;

		/**
		 * Parameters holder
		 */
		this._parameters = {
			preview: null,
			lang: 'en',
			dictionary: null,
			...parameters
		};

        //Errors checking
        if(!this.input){
			throw console.warn('ImageInputPreview: '+(typeof target == 'string' ? 'The selector `'+target+'` didn\'t match any element.' : 'The element you provided was undefined'));
		}else if(this.input.classList.contains('iip-initialized')){
			throw console.warn('ImageInputPreview: The element has already been initialized.');
		}else{
			this._loadDictionary();
			this._build();
			this._listen();
		}
	}

	/**
     * Loads the dictionary
     * @private
     */
    _loadDictionary(){
		/** @private */
		this._dictionary = {
			...this._parameters.dictionary,
			en: {
				upload: 'Upload image',
				...(this._parameters.dictionary || {}).en
			},
			fr: {
				upload: 'Télécharger une image',
				...(this._parameters.dictionary || {}).fr
			}
		};
	}

	/**
	 * Builds the ImageInputPreview module in the DOM
	 * @private
	 */
	_build(){
		this.input.classList.add('iip-input', 'iip-initialized');

		/**
		 * Input preview
		 * @type {Element}
		 */
		this.preview = document.createElement('img');

		this.preview.classList.add('iip-preview');
		this.preview.src = this._parameters.preview || 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDYwIDYwIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNTAuOTc1IDIwLjY5NGMtMC41MjctOS03Ljk0Ni0xNi4xOTQtMTYuODkxLTE2LjE5NC01LjQzIDAtMTAuNjg4IDIuNjYzLTEzLjk0NiA3LjAwOC0wLjA3NC0wLjAzOS0wLjE1My0wLjA2NS0wLjIyOC0wLjEwMi0wLjE5OC0wLjA5Ni0wLjM5OS0wLjE4OC0wLjYwNS0wLjI2OS0wLjExNS0wLjA0NS0wLjIzLTAuMDg2LTAuMzQ2LTAuMTI3LTAuMjAyLTAuMDcxLTAuNDA2LTAuMTMzLTAuNjE1LTAuMTktMC4xMTYtMC4wMzEtMC4yMzEtMC4wNjMtMC4zNDktMC4wOS0wLjIyNC0wLjA1MS0wLjQ1Mi0wLjA5LTAuNjgzLTAuMTI0LTAuMTAyLTAuMDE1LTAuMjAyLTAuMDM1LTAuMzA1LTAuMDQ3LTAuMzMtMC4wMzYtMC42NjYtMC4wNTktMS4wMDctMC4wNTktNC45NjIgMC05IDQuMDM3LTkgOSAwIDAuMTI5IDdlLTMgMC4yNTUgMC4wMTYgMC4zODEtNC4xNTkgMi4yNjctNy4wMTYgNy4wMTgtNy4wMTYgMTEuNzczIDAgNy4wODMgNS43NjIgMTIuODQ2IDEyLjg0NSAxMi44NDZoNS4xNTVjMC41NTIgMCAxLTAuNDQ3IDEtMXMtMC40NDgtMS0xLTFoLTUuMTU1Yy01Ljk4IDAtMTAuODQ1LTQuODY1LTEwLjg0NS0xMC44NDYgMC00LjE1NCAyLjcwNS04LjQ2NiA2LjQzMi0xMC4yNTNsMC41NjgtMC4yNzF2LTAuNjNjMC0wLjEyMyA4ZS0zIC0wLjI0OSAwLjAxNS0wLjM3NWw5ZS0zIC0wLjE3NS0wLjAxMi0wLjE4OGMtNWUtMyAtMC4wODctMC4wMTItMC4xNzQtMC4wMTItMC4yNjIgMC0zLjg1OSAzLjE0LTcgNy03IDAuMzA5IDAgMC42MTQgMC4wMjcgMC45MTcgMC4wNjcgMC4wNzggMC4wMSAwLjE1NSAwLjAyMyAwLjIzMiAwLjAzNiAwLjI2OCAwLjA0NCAwLjUzMiAwLjEwMiAwLjc5MiAwLjE3NyAwLjAzNCAwLjAxIDAuMDY5IDAuMDE2IDAuMTAyIDAuMDI2IDAuMjg2IDAuMDg3IDAuNTY1IDAuMTk4IDAuODM4IDAuMzIyIDAuMDY5IDAuMDMxIDAuMTM3IDAuMDY1IDAuMjA1IDAuMDk5IDAuMjQyIDAuMTE5IDAuNDc5IDAuMjUxIDAuNzA3IDAuMzk5IDEuOTI3IDEuMjQ5IDMuMjA3IDMuNDEzIDMuMjA3IDUuODc0IDAgMC41NTMgMC40NDggMSAxIDFzMS0wLjQ0NyAxLTFjMC0yLjc1NC0xLjI0Ni01LjIxOS0zLjItNi44NzEgMi44NjYtMy43NSA3LjU4OC02LjEyOSAxMi4yODQtNi4xMjkgNy43NDQgMCAxNC4xNzggNi4xMzUgMTQuODQ4IDEzLjg4Ny0xLjAyMi0wLjA3Mi0yLjU1My0wLjEwOS00LjA4MyAwLjEyNS0wLjU0NiAwLjA4My0wLjkyMSAwLjU5My0wLjgzOCAxLjEzOSAwLjA3NSAwLjQ5NSAwLjUwMSAwLjg1IDAuOTg3IDAuODUgMC4wNSAwIDAuMTAxLTRlLTMgMC4xNTItMC4wMTIgMi4yMjQtMC4zMzYgNC41NDMtMC4wMjEgNC42ODQtMmUtMyA0LjY1NiAwLjg4NSA4LjE2NiA1LjE3NCA4LjE2NiA5Ljk4NSAwIDUuNTI5LTQuNDk5IDEwLjAyOC0xMC4wMjggMTAuMDI4aC0zLjk3MmMtMC41NTIgMC0xIDAuNDQ3LTEgMXMwLjQ0OCAxIDEgMWgzLjk3MmM2LjYzMiAwIDEyLjAyOC01LjM5NiAxMi4wMjgtMTIuMDI4IDAtNS40ODktMy44MjctMTAuNDEyLTkuMDI1LTExLjc3OHoiLz48cGF0aCBkPSJtMzEuNzA4IDMwLjc5NGMtMC4wOTItMC4wOTMtMC4yMDMtMC4xNjYtMC4zMjYtMC4yMTctMC4yNDQtMC4xMDEtMC41Mi0wLjEwMS0wLjc2NCAwLTAuMTIzIDAuMDUxLTAuMjMzIDAuMTI0LTAuMzI2IDAuMjE3bC03Ljk5OSA3Ljk5OWMtMC4zOTEgMC4zOTEtMC4zOTEgMS4wMjMgMCAxLjQxNCAwLjE5NSAwLjE5NSAwLjQ1MSAwLjI5MyAwLjcwNyAwLjI5M3MwLjUxMi0wLjA5OCAwLjcwNy0wLjI5M2w2LjI5My02LjI5M3YyMC41ODZjMCAwLjU1MyAwLjQ0OCAxIDEgMXMxLTAuNDQ3IDEtMXYtMjAuNTg2bDYuMjkzIDYuMjkzYzAuMTk1IDAuMTk1IDAuNDUxIDAuMjkzIDAuNzA3IDAuMjkzczAuNTEyLTAuMDk4IDAuNzA3LTAuMjkzYzAuMzkxLTAuMzkxIDAuMzkxLTEuMDIzIDAtMS40MTRsLTcuOTk5LTcuOTk5eiIvPjwvc3ZnPg==';
		this.preview.setAttribute('title', this._dictionary[this._parameters.lang].upload)

		this.input.after(this.preview);

		/**
		 * Image title
		 * @type {Element}
		 * @private
		 */
		this._title = document.createElement('span');
		this._title.classList.add('iip-title');
		this.preview.after(this._title);
	}

	/**
	 * Listens to necessary events
	 */
	_listen(){
		this.preview.addEventListener('click', () => {
			this.input.click();
		});

		this.input.addEventListener('change', () => {
			if(this.input.files && this.input.files[0]){
				if(this.input.files[0].type.startsWith('image/')){
					const reader = new FileReader();

					reader.onload = r => {
						this.preview.src = r.target.result;
					};
	
					reader.readAsDataURL(this.input.files[0]);
				}
				
				this._title.innerText = this.input.files[0].name;

				this.changed = true;
			}
		});
	}
}

// Initialize inputs the data- way
window.addEventListener('load', () => {
	let inputs = document.querySelectorAll('input[type="file"][data-preview]');

	inputs.forEach(input => {
		new ImageInputPreview(input, {
			preview: input.getAttribute('data-preview')
		});
	});
});