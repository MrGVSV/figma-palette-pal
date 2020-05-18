/**
 * Save data to local storage
 * 
 * @param type The key to set
 * @param data The data
 */
export function post(type: string, data: any) {
	parent.postMessage(
		{
			pluginMessage: {
				type: type,
				data: data,
			},
		},
		"*",
	);
}
/**
 * Request data from local storage
 * 
 * @param type The key to get
 * @param data The data
 */
export function get(type: string, data: any = {}) {
	parent.postMessage(
		{
			pluginMessage: {
				type: type,
				data: data,
			},
		},
		"*",
	);
}
