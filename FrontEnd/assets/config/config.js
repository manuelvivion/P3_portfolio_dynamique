export async function configServerAddress(){ //we get URL from config json file
    const reponse = await fetch("assets/config/config.json");
	const server = await reponse.json();
    const hostAddress = server.host; // only 1 attribute : host in the json file
    return hostAddress;
}