/**
 * Types of DC motor control
 */
enum DCmotion {
	//% block="Forward"
	Forward,
	//% block="Backward"
	Backward,
	//% block="Brake"
	Brake
}

enum connectorDCMotor {
	//% block="M0"
	M0,
	//% block="M1"
	M1
}

enum connectorTouchSensor {
	//% block="A"
	A,
	//% block="B"
	B
}

enum connectorServoMotor {
	//% block="C13"
	C13 = AnalogPin.C13,
	//% block="C14"
	C14 = AnalogPin.C14,
	//% block="C15"
	C15 = AnalogPin.C15
}



enum connectorAnalogSensor {
	//% block="P0"
	P0 = AnalogPin.P0,
	//% block="P1"
	P1 = AnalogPin.P1,
	//% block="P2"
	P2 = AnalogPin.P2
}

enum connectorDigitalSensor {
	//% block="P0"
	P0 = DigitalPin.P0,
	//% block="P1"
	P1 = DigitalPin.P1,
	//% block="P2"
	P2 = DigitalPin.P2
}




/**
 * ArtecRobo control package
 */
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo"
//% groups="['Motor', 'Sensor', 'LED', 'Sound']"
namespace artecrobo {

	// ToDo 変数名を変更する

	let is_body_buzzer_play = false;
	const ultrasonicBusyMap: { [pin: number]: boolean } = {}

	let angleP13 = 90;
	let angleP14 = 90;
	let angleP15 = 90;
	pins.servoWritePin(AnalogPin.P13, angleP13);
	pins.servoWritePin(AnalogPin.P14, angleP14);
	pins.servoWritePin(AnalogPin.P15, angleP15);

	/* spped initial value */
	let speedM0 = 100;
	let speedM1 = 100;
	let state = DCmotion.Brake;


	type DeviceState =
		| { kind: 'idle' }
		| { kind: 'active'; note: number; };

	interface pinconnector {
		name: string;
		state: {
			led: DeviceState;
			buzzer: DeviceState;
		};
	};

	const pinStates: pinconnector[] = [
		{ name: 'P0', state: { led: { kind: 'idle' }, buzzer: { kind: 'idle' } } },
		{ name: 'P1', state: { led: { kind: 'idle' }, buzzer: { kind: 'idle' } } },
		{ name: 'P2', state: { led: { kind: 'idle' }, buzzer: { kind: 'idle' } } }
	];

	function set_led_state(name: string, kind: DeviceState): void {
		for (let i = 0; i < pinStates.length; i++) {
			if (pinStates[i].name === name) {
				pinStates[i].state.led = kind;
			}
		}
	}

	function set_buzzer_state(name: string, kind: DeviceState): void {
		for (let i = 0; i < pinStates.length; i++) {
			if (pinStates[i].name === name) {
				pinStates[i].state.buzzer = kind;
			}
		}
	}


	function ledStateIs(name: string, kind: string): boolean {
		for (let i = 0; i < pinStates.length; i++) {
			if (pinStates[i].name === name) {
				return pinStates[i].state.led.kind === kind
			}
		}
		return false
	}

	function buzzerStateIs(name: string, kind: string): boolean {
		for (let i = 0; i < pinStates.length; i++) {
			if (pinStates[i].name === name) {
				return pinStates[i].state.buzzer.kind === kind
			}
		}
		return false
	}


	type AnyConnector = connectorDigitalSensor | connectorAnalogSensor;

	function getConnectorName(connector: AnyConnector): string {
		switch (connector) {
			case connectorDigitalSensor.P0: return "P0";
			case connectorDigitalSensor.P1: return "P1";
			case connectorDigitalSensor.P2: return "P2";
			case connectorAnalogSensor.P0: return "P0";
			case connectorAnalogSensor.P1: return "P1";
			case connectorAnalogSensor.P2: return "P2";
			default: return "unknown";
		}
	}

	const connectorNameToEnum: { [key: string]: connectorDigitalSensor } = {
    "P0": connectorDigitalSensor.P0,
    "P1": connectorDigitalSensor.P1,
    "P2": connectorDigitalSensor.P2
	};

	//% blockId=artec_light_sensor
	//% block="light sensor %_connector"
	//% group="Sensor"
	export function lightSensor(_connector: connectorAnalogSensor): number {
		return pins.analogReadPin(_connector);
	}

	//% blockId=artec_sound_sensor
	//% block="sound sensor %_connector"
	//% group="Sensor"
	export function soundSensor(_connector: connectorAnalogSensor): number {
		return pins.analogReadPin(_connector);
	}

	//% blockId=artec_photo_reflector
	//% block="ir photoreflector %_connector"
	//% group="Sensor"
	export function irPhotoreflector(_connector: connectorAnalogSensor): number {
		return pins.analogReadPin(_connector);
	}

	//% blockId=artec_temperature_sensor
	//% block="temperature sensor %_connector"
	//% group="Sensor"
	export function temperatureSensor(_connector: connectorAnalogSensor): number {
		return (pins.analogReadPin(_connector) / 1023 * 3300 - 500) / 10;
	}

	//% blockId=artec_water_level_sensor
	//% block="waterlevel sensor %_connector"
	//% group="Sensor"
	export function waterlevelSensor(_connector: connectorAnalogSensor): number {
		return pins.analogReadPin(_connector);
	}


	function getdist(_connector: connectorDigitalSensor): number {
		pins.digitalWritePin(_connector, 0);
		control.waitMicros(2);
		pins.digitalWritePin(_connector, 1);
		control.waitMicros(10)
		pins.digitalWritePin(_connector, 0);
		const pulse_time = pins.pulseIn(_connector, PulseValue.High, 20000);
		const dist = pulse_time * 34000 / 1000000 / 2;
		pins.digitalWritePin(_connector, 0);
		basic.pause(10);
		return dist;
	}

	//% blockId=artec_ultrasonic_sensor
	//% block="ultrasonic sensor %_connector"
	//% group="Sensor"
	export function ultraSonicSensor(_connector: connectorDigitalSensor): number {
		const pinId = _connector as number;

		while (ultrasonicBusyMap[pinId]) {
			basic.pause(5)
		}
		ultrasonicBusyMap[pinId] = true

		const delay = Math.floor(Math.random() * 11) + 5; // 5〜15ms
		basic.pause(delay);

		const dist = getdist(_connector);

		ultrasonicBusyMap[pinId] = false;
		return dist
	}

	//% blockId=artec_is_touch_sensor_pressed
	//% block="touch sensor %_connector pressed"
	//% group="Sensor"
	export function isTouchSensorPressed(_connector: connectorTouchSensor): boolean {
		switch (_connector) {
			case connectorTouchSensor.A:
				if (pins.digitalReadPin(DigitalPin.P5) == 0) return true;
				return false;
			case connectorTouchSensor.B:
				if (pins.digitalReadPin(DigitalPin.P11) == 0) return true;
				return false;
			default:
				return false;
		}
	}

	//% blockId=artec_on_touchsensor_pressed
	//% block="on touch sensor %_connector pressed "
	//% group="Sensor"
	export function onTouchSensorPressed(_connector: connectorTouchSensor, handler: () => void) {
		switch (_connector) {
			case connectorTouchSensor.A:
				input.onButtonPressed(Button.A, handler);
				break;
			case connectorTouchSensor.B:
				input.onButtonPressed(Button.B, handler);
				break;
		}
	}

	//% blockkId=artec_is_led_on
	//% block="LED %_connector is on"
	//% group="LED"
	export function isLEDOn(_connector: connectorDigitalSensor): boolean {
		const name = getConnectorName(_connector)
		return ledStateIs(name, 'active');
	}

	//% blockId=artec_LED_off
	//% block="LED %_connector off"
	//% group="LED"
	export function turnOffLED(_connector: connectorDigitalSensor) {
		const name = getConnectorName(_connector)
		if (ledStateIs(name, 'active')) {
			set_led_state(name, { kind: 'idle' });
			pins.digitalWritePin(_connector, 0);
		}
	}

	//% blockId=artec_LED_on
	//% block="LED %_connector on"
	//% group="LED"
	export function turnOnLED(_connector: connectorDigitalSensor) {
		const name = getConnectorName(_connector)
		pins.digitalWritePin(_connector, 1);
		if (ledStateIs(name, 'idle')) {
			set_led_state(name, { kind: 'active', note: 0 })
		}
	}

	//% blockId=artec_buzzer_playing
	//% block="buzzer %_connector playing"
	//% group="Sound"
	export function isBuzzerplaying(_connector: connectorDigitalSensor): boolean {
		const name = getConnectorName(_connector);
		return buzzerStateIs(name, 'active');
	}

	//% blockId=artec_buzzer_off
	//% block="buzzer %_connector off"
	//% group="Sound"
	export function turnOffBuzzer(_connector: connectorDigitalSensor) {
		pins.analogWritePin(_connector, 0);
		const name = getConnectorName(_connector);
		set_buzzer_state(name, { kind: 'idle' })
	}

	function playBuzzer(_connector: connectorDigitalSensor, _note: number) {
		const periodus = 1000000 / _note;
		pins.analogWritePin(_connector, 512);
		pins.analogSetPeriod(_connector, periodus);
	}

	//% blockId=artec_buzz_on
	//% block="buzzer %_connector on frequency %_note"
	//% _note.shadow="device_note"
	//% group="Sound"
	export function turnOnBuzzer(_connector: connectorDigitalSensor, _note: number) {
		const name = getConnectorName(_connector);
		playBuzzer(_connector, _note)
		set_buzzer_state(name, { kind: 'active', note: _note });
	}

	//% blockId=artec_buzz_off_both
	//% block="speaker and buzzer %_connector off"
	//% group="Sound"
	export function turnOffSpeakerAndBuzzer(_connector: connectorDigitalSensor) {
		music.stopAllSounds();
		const name = getConnectorName(_connector);
		set_buzzer_state(name, { kind: 'idle' });
		is_body_buzzer_play = false;
		for (let i = 0; i < pinStates.length; i++) {
			// 指定端子以外のブザーがonの時の処理
			if (pinStates[i].name === name) continue;

			const nowbuzzer = pinStates[i].state.buzzer;
			if (nowbuzzer.kind === 'active'){
				const pinEnum = connectorNameToEnum[pinStates[i].name];
				playBuzzer(pinEnum, nowbuzzer.note);
			} 
		};
	}

	//% blockId=artec_buzz_on_both
	//% block="speaker and buzzer %_connector on frequency %_note"
	//% _note.shadow="device_note"
	//% group="Sound"
	export function turnOnSpeakerAndBuzzer(_connector: connectorDigitalSensor, _note: number) {
		music.ringTone(_note);
		playBuzzer(_connector, _note);
		const name = getConnectorName(_connector);
		is_body_buzzer_play = true;
		set_buzzer_state(name, { kind: 'active', note: _note })
	}

	//% blockId=artec_move_servo_motor_max
	//% block="move servo pin %_connector| to (degrees) %_angle"
	//% _angle.min=0 _angle.max=180
	//% group="Motor"
	export function moveServoMotorMax(_connector: connectorServoMotor, _angle: number): void {
		if (_angle < 0) { _angle = 0; }
		if (_angle > 180) { _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.C13:
				pins.servoWritePin(AnalogPin.P13, _angle);
				angleP13 = _angle;
				break;
			case connectorServoMotor.C14:
				pins.servoWritePin(AnalogPin.P14, _angle);
				angleP14 = _angle;
				break;
			case connectorServoMotor.C15:
				pins.servoWritePin(AnalogPin.P15, _angle);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	//% blockId=artec_move_servo_motor
	//% block="move servo pin %_connector| to (degrees) %_angle| speed: %_speed"
	//% _angle.min=0 _angle.max=180
	//% _speed.min=0 _speed.max=20
	//% group="Motor"
	export function moveServoMotor(_connector: connectorServoMotor, _angle: number, _speed: number): void {
		if (_speed < 1) { _speed = 1; }
		if (_speed > 20) { _speed = 20; }
		if (_angle < 0) { _angle = 0; }
		if (_angle > 180) { _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.C13:
				moveservo(AnalogPin.P13, angleP13, _angle, _speed);
				angleP13 = _angle;
				break;
			case connectorServoMotor.C14:
				moveservo(AnalogPin.P14, angleP14, _angle, _speed);
				angleP14 = _angle;
				break;
			case connectorServoMotor.C15:
				moveservo(AnalogPin.P15, angleP15, _angle, _speed);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	function moveservo(_pin: AnalogPin, _FromAngle: number, _ToAngle: number, _speed: number): void {
		const diff = Math.abs(_ToAngle - _FromAngle);
		if (diff == 0) return;

		const interval = Math.abs(_speed - 20) + 3;
		let dir = 1;
		if (_ToAngle - _FromAngle < 0) {
			dir = -1;
		}
		for (let i = 1; i <= diff; i++) {
			_FromAngle = _FromAngle + dir;
			pins.servoWritePin(_pin, _FromAngle);
			basic.pause(interval);
		}
	}

	/**
	 * Move Servo Motor Async.
	 * @param speed speed
	 * @param angle13 ServoMotor Angle P13
	 * @param angle14 ServoMotor Angle P14
	 * @param angle15 ServoMotor Angle P15
	 */
	//% weight=84
	//% blockId=artec_async_move_servo_motor
	//% block="move servo synchronously | speed: %_speed| C13 (degrees): %_angle13| C14 (degrees): %_angle14| C15 (degrees): %_angle15"
	//% group="Motor"
	//% _speed.min=1 _speed.max=20
	//% _angle13.min=0 _angle13.max=180
	//% _angle14.min=0 _angle14.max=180
	//% _angle15.min=0 _angle15.max=180
	export function AsyncMoveServoMotor(_speed: number, _angle13: number, _angle14: number, _angle15: number): void {
		if (_speed < 0) { _speed = 0; }
		if (_speed > 20) { _speed = 20; }
		if (_angle13 < 0) { _angle13 = 0; }
		if (_angle13 > 180) { _angle13 = 180; }
		if (_angle14 < 0) { _angle14 = 0; }
		if (_angle14 > 180) { _angle14 = 180; }
		if (_angle15 < 0) { _angle15 = 0; }
		if (_angle15 > 180) { _angle15 = 180; }
		const interval = Math.abs(_speed - 20) + 3;
		// サーボモーターを動かす方向
		let dirP13 = 1;
		if (_angle13 - angleP13 < 0) {
			dirP13 = -1;
		}

		let dirP14 = 1;
		if (_angle14 - angleP14 < 0) {
			dirP14 = -1;
		}

		let dirP15 = 1;
		if (_angle15 - angleP15 < 0) {
			dirP15 = -1;
		}

		const diffP13 = Math.abs(angleP13 - _angle13);    // 変化量
		const diffP14 = Math.abs(angleP14 - _angle14);    // 変化量
		const diffP15 = Math.abs(angleP15 - _angle15);    // 変化量
		let maxData = Math.max(diffP13, diffP14);
		maxData = Math.max(maxData, diffP15);

		let divideP13 = 0;
		if (diffP13 != 0) {
			divideP13 = maxData / diffP13;  // 1度変化させる間隔
		}

		let divideP14 = 0;
		if (diffP14 != 0) {
			divideP14 = maxData / diffP14;  // 1度変化させる間隔
		}

		let divideP15 = 0;
		if (diffP15 != 0) {
			divideP15 = maxData / diffP15;  // 1度変化させる間隔
		}

		for (let i = 1; i <= maxData; i++) {
			if (diffP13 != 0) {
				if (i % divideP13 == 0) {
					angleP13 = angleP13 + dirP13;
					pins.servoWritePin(AnalogPin.P13, angleP13);
				}
			}
			if (diffP14 != 0) {
				if (i % divideP14 == 0) {
					angleP14 = angleP14 + dirP14;
					pins.servoWritePin(AnalogPin.P14, angleP14);
				}
			}
			if (diffP15 != 0) {
				if (i % divideP15 == 0) {
					angleP15 = angleP15 + dirP15;
					pins.servoWritePin(AnalogPin.P15, angleP15);
				}
			}
			basic.pause(interval);
		}
		// 最後に全部そろえる。
		angleP13 = _angle13;
		angleP14 = _angle14;
		angleP15 = _angle15;
		if (diffP13 != 0) pins.servoWritePin(AnalogPin.P13, angleP13);
		if (diffP14 != 0) pins.servoWritePin(AnalogPin.P14, angleP14);
		if (diffP15 != 0) pins.servoWritePin(AnalogPin.P15, angleP15);
	}

	//% blockId=artec_set_speed_dc_motor
	//% block="DC motor %_connector| speed: %_speed"
	//% _speed.min=0 _speed.max=100
	//% group="Motor"
	export function setSpeedDCMotor(_connector: connectorDCMotor, _percentSpeed: number): void {
		if (_connector == connectorDCMotor.M0) {
			speedM0 = _percentSpeed;
		} else {
			speedM1 = _percentSpeed;
		}
		if (state == DCmotion.Forward || state == DCmotion.Backward) {
			moveDCMotor(_connector, state);
		}
	}

	// Move DC motor
	//% blockId=artec_move_dc_motor
	//% block="DC motor %_connector| motion: %_motion"
	//% group="Motor"
	export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
		switch (_motion) {
			case DCmotion.Forward:
				if (_connector == connectorDCMotor.M0) {
					motors.dualMotorPower(Motor.M0, -speedM0);
				} else {
					motors.dualMotorPower(Motor.M1, -speedM1);
				}
				break;
			case DCmotion.Backward:
				/*
					Move Backward
					M1:P8 = 0, P12 = speeed
					M2:P0 = 0, P16 = speeed
				*/
				if (_connector == connectorDCMotor.M0) {
					motors.dualMotorPower(Motor.M0, speedM0);
				} else {
					motors.dualMotorPower(Motor.M1, speedM1);
				}
				break;
			case DCmotion.Brake:
				/*
					Brake
					M1:P8 = 1, P12 = 1
					M2:P0 = 1, P16 = 1
				*/
				if (_connector == connectorDCMotor.M0) {
					motors.dualMotorPower(Motor.M0, 0);
				} else {
					motors.dualMotorPower(Motor.M1, 0);
				}
				break;
		}
		state = _motion;
	}
}
