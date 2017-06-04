var animations : String[];
private var currentAnimationID : int;
private var currentAnimationName : String;
private var previousAnimationName : String;
private var showSword : boolean = true;
var femaleWarrior : Transform;
var femaleWarriorPants : Transform;
var sword : Transform;
//Sounds.
//footsteps.
var footStepAudio : Transform[];
var footStepAudioRun : Transform[];
private var lastFootStepTime : float;
private var footStepToogle : boolean = true;
//swoosh.
var swooshAudio : Transform;
private var lastSwooshTime : float;
private var swooshToogle : boolean = true;
private var newAnimation;
var sexyWalkBlend : float = 1.0;
var slider1Script : slider1;
var slider1 : GUITexture;
var slider2 : GUITexture;
var info3 : GUIText;

function Start(){
	currentAnimationID = 0;
	currentAnimationName = GetAnimationName(animations[currentAnimationID]);
	previousAnimationName = currentAnimationName;
	newAnimation = true;
}

function Update(){
	GetComponent.<GUIText>().text = "Press left and right arrow keys to switch animations. Currently playing: ";
	GetComponent.<GUIText>().text += currentAnimationName;
	//Switch animations.
	
	if(Input.GetKeyDown(KeyCode.RightArrow)){
		newAnimation = true;
		currentAnimationID ++;
		if(currentAnimationID >= animations.Length){
			currentAnimationID = 0;
		}
	}
	if(Input.GetKeyDown(KeyCode.LeftArrow)){
		newAnimation = true;
		currentAnimationID --;
		if(currentAnimationID < 0){
			currentAnimationID = animations.Length-1;
		}
	}
	//Sword switch.
	if(Input.GetKeyDown(KeyCode.Alpha1)){
		if(showSword){
			showSword = false;
			sword.GetComponent.<Renderer>().enabled = false;
		}
		else{
			showSword = true;
			sword.GetComponent.<Renderer>().enabled = true;
		}
		newAnimation = true;
	}
	//Toggle skirt.
	if(Input.GetKeyDown(KeyCode.Alpha2)){
		if(femaleWarrior.Find("femaleWarrior").GetComponent.<Renderer>().enabled){
			femaleWarrior.Find("femaleWarrior").GetComponent.<Renderer>().enabled = false;
			femaleWarriorPants.Find("femaleWarriorPants").GetComponent.<Renderer>().enabled = true;
		}
		else{
			femaleWarrior.Find("femaleWarrior").GetComponent.<Renderer>().enabled = true;
			femaleWarriorPants.Find("femaleWarriorPants").GetComponent.<Renderer>().enabled = false;			
		}
	}
	//Play animations.
	if(newAnimation){
		isShooting = false;
		currentAnimationName = GetAnimationName(animations[currentAnimationID]);
		var normalizedTime : float;
		if(GetRewind(currentAnimationName)){
			normalizedTime = 0.0;
		}
		else{
			normalizedTime = femaleWarrior.GetComponent.<Animation>()[previousAnimationName].normalizedTime;
		}
		//Female warrior.
		femaleWarrior.GetComponent.<Animation>().Blend(previousAnimationName,0.0);
		femaleWarrior.GetComponent.<Animation>().Blend(currentAnimationName, 1.0);
		femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime = normalizedTime;
		femaleWarriorPants.GetComponent.<Animation>().Blend(previousAnimationName,0.0);
		femaleWarriorPants.GetComponent.<Animation>().Blend(currentAnimationName, 1.0);
		femaleWarriorPants.GetComponent.<Animation>()[currentAnimationName].normalizedTime = normalizedTime;		
		if(currentAnimationName == "shoot"){
			isShooting = true;
		}
		//Auto toggle guns.
		if(previousAnimationName != currentAnimationName){
			switch(currentAnimationName){
				case "die1":
				case "die2":
					if(sword.GetComponent.<Renderer>().enabled == true){
						showSword = false;
						sword.GetComponent.<Renderer>().enabled = false;
					}	
					break;
				case "swordStance":
				case "swordStrike1":
				case "swordStrike2":
				case "swordStrike3":
				case "swordStrike4":
				case "swordKick":
				case "swordBlocking":
				case "swordBlockingHit":
					if(sword.GetComponent.<Renderer>().enabled ==  false){
						showSword = true;
						sword.GetComponent.<Renderer>().enabled = true;
					}				
					break;
			}
		}
		//Set previous.
		previousAnimationName = currentAnimationName;
	}
	//Sexy walk.
	sexyWalkBlend = slider1Script.amount;
	sexyWalkBlend = Mathf.Clamp01(sexyWalkBlend);
	if(currentAnimationName != "walk"){
		femaleWarrior.GetComponent.<Animation>().Blend("walkSexy",0.0);
		femaleWarriorPants.GetComponent.<Animation>().Blend("walkSexy",0.0);
	}
	else{
		femaleWarrior.GetComponent.<Animation>().Blend("walkSexy",sexyWalkBlend);
		femaleWarrior.GetComponent.<Animation>().Blend("walk",1-sexyWalkBlend);
		femaleWarrior.GetComponent.<Animation>()["walkSexy"].normalizedTime =femaleWarrior.GetComponent.<Animation>()["walk"].normalizedTime;
		femaleWarriorPants.GetComponent.<Animation>().Blend("walkSexy",sexyWalkBlend);
		femaleWarriorPants.GetComponent.<Animation>().Blend("walk",1-sexyWalkBlend);
		femaleWarriorPants.GetComponent.<Animation>()["walkSexy"].normalizedTime =femaleWarrior.GetComponent.<Animation>()["walk"].normalizedTime;
	}
	if(currentAnimationName != "walkSword"){
		femaleWarrior.GetComponent.<Animation>().Blend("walkSexySword",0.0);
		femaleWarriorPants.GetComponent.<Animation>().Blend("walkSexySword",0.0);
	}
	else{
		femaleWarrior.GetComponent.<Animation>().Blend("walkSexySword",sexyWalkBlend);
		femaleWarrior.GetComponent.<Animation>().Blend("walkSword",1-sexyWalkBlend);
		femaleWarrior.GetComponent.<Animation>()["walkSexySword"].normalizedTime =femaleWarrior.GetComponent.<Animation>()["walkSword"].normalizedTime;
		femaleWarriorPants.GetComponent.<Animation>().Blend("walkSexySword",sexyWalkBlend);
		femaleWarriorPants.GetComponent.<Animation>().Blend("walkSword",1-sexyWalkBlend);
		femaleWarriorPants.GetComponent.<Animation>()["walkSexySword"].normalizedTime =femaleWarrior.GetComponent.<Animation>()["walkSword"].normalizedTime;
	}
	switch (currentAnimationName){
		case "walk":
		case "walkSword":
			slider1.enabled = true;
			slider2.enabled = true;
			info3.enabled = true;
			slider1.enabled = true;
			break;
		default:
			slider1.enabled = false;
			slider2.enabled = false;
			info3.enabled = false;
			slider1.enabled = false;
		break;
	}
	//Sound.
	if(Time.time > lastFootStepTime + 0.35){
		footStepToogle = true;
	}
	if(Time.time > lastSwooshTime + 0.4){
		swooshToogle = true;
	}
		newAnimation = false;
}

function GetAnimationName(animationName : String):String{
	if(sword.GetComponent.<Renderer>().enabled){
		switch(animationName){
			case "idle":
			case "walk":
			case "walkSexy":
			case "run":
			case "sprint":
			case "strafeRight":
			case "strafeLeft":
			case "crouchIdle":
			case "crouchWalk":
			case "crouchRun":
			case "crouchStrafeRight":
			case "crouchStrafeLeft":
			animationName += "Sword";
		}
	}
	return animationName;
}

function GetRewind(animationName : String):boolean{
	switch(animationName){
		case "jump":
		case "swordStance":
		case "swordStrike1":
		case "swordStrike2":
		case "swordStrike3":
		case "swordStrike4":
		case "swordKick":
		case "die1":
		case "die2":
		case "swordBlockingHit":
		return true;
	}
	return false;
}

function FootStepSound(normalizedTime : float){
	var currentNormalizedTime : float = femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime - Mathf.Floor(femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime);
	if(Mathf.Abs(currentNormalizedTime - normalizedTime) < 0.1 && footStepToogle){
		var randomID = Mathf.Floor(Random.value * footStepAudio.Length);
		footStepAudio[randomID].GetComponent.<AudioSource>().Play();
		footStepAudio[randomID].GetComponent.<AudioSource>().pitch = Random.Range(0.65,0.75);
		footStepAudio[randomID].GetComponent.<AudioSource>().volume = Random.Range(0.45,0.55);
		lastFootStepTime = Time.time;
		footStepToogle = false;
	}
}

function FootStepRunSound(normalizedTime : float){
	var currentNormalizedTime : float = femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime - Mathf.Floor(femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime);
	if(Mathf.Abs(currentNormalizedTime - normalizedTime) < 0.1 && footStepToogle){
		var randomID = Mathf.Floor(Random.value * footStepAudio.Length);
		footStepAudioRun[randomID].GetComponent.<AudioSource>().Play();
		footStepAudioRun[randomID].GetComponent.<AudioSource>().pitch = Random.Range(0.75,0.85);
		footStepAudioRun[randomID].GetComponent.<AudioSource>().volume = Random.Range(0.65,0.75);
		lastFootStepTime = Time.time;
		footStepToogle = false;
	}
}

function SwooshSound(normalizedTime : float){
	var currentNormalizedTime : float = femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime - Mathf.Floor(femaleWarrior.GetComponent.<Animation>()[currentAnimationName].normalizedTime);	
	if(Mathf.Abs(currentNormalizedTime - normalizedTime) < 0.1 && swooshToogle){
		swooshAudio.GetComponent.<AudioSource>().Play();
		swooshAudio.GetComponent.<AudioSource>().pitch = Random.Range(0.9,1.2);
		swooshAudio.GetComponent.<AudioSource>().volume = Random.Range(0.65,0.75);
		lastSwooshTime = Time.time;
		swooshToogle = false;
	}
}
