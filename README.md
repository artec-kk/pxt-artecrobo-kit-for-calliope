 
# ArtecRobo

[Extension for ArtecRobo](https://www.artec-kk.co.jp/en/images/056720.pdf#page=36)

## Basic Usage

* Run a command when you press a Touch Sensor

Use this to run an event when you press a Touch Sensor. You can specify A or B.

```blocks
// Show a heart icon when you press the Touch Sensor:
artecrobo.onTouchSensorPressed(connectorTouchSensor.A, function () {
    basic.showIcon(IconNames.Heart)
})
```

* Check if a Touch Sensor is pressed

Use this to check if the Touch Sensor is pressed. You can specify A or B.

```blocks
// Press the Touch Sensor to show a heart icon:
if (artecrobo.isTouchSensorPressed(connectorTouchSensor.A)) {
    basic.showIcon(IconNames.Heart)
}
```

* Detect an object’s distance from an Ultrasonic Sensor

Use this to get the value of an Ultrasonic Sensor. You can specify P0, P1, or P2.

```blocks
// Get the distance of an object to an Ultrasonic Sensor on P0 through serial:
serial.writeLine("" + (artecrobo.ultraSonicSensor(connectorDigitalSensor.P0)))
```

* Get the value of a Water Level Sensor

Use this to get the value of a Water Level Sensor. You can specify P0, P1, or P2.

```blocks
// Get the value of a Water Level on P0 through serial:
serial.writeLine("" + (artecrobo.waterlevelSensor(connectorAnalogSensor.P0)))
```

* Get the value of a Temperature Sensor

Use this to get the value of a Temperature Sensor. You can specify P0, P1, or P2.

```blocks
// Get the value of a Temperature Sensor on P0 through serial:
serial.writeLine("" + (artecrobo.temperatureSensor(connectorAnalogSensor.P0)))
```

* Get the value of an IR Photoreflector

Use this to get the value of an IR Photoreflector. You can specify P0, P1, or P2.

```blocks
// Get the value of a IR Photoreflector on P0 through serial:
serial.writeLine("" + (artecrobo.irPhotoreflector(connectorAnalogSensor.P0)))
```

* Get the value of a Sound Sensor

Use this to get the value of a Sound Sensor. You can specify P0, P1, or P2.

```blocks
// Get the value of a Sound Sensor on P0 through serial:
serial.writeLine("" + (artecrobo.soundSensor(connectorAnalogSensor.P0)))
```

* Get the value of a Light Sensor

Use this to get the value of a Light Sensor. You can specify P0, P1, or P2.

```blocks
// Get the value of a Light Sensor on P0 through serial:
serial.writeLine("" + (artecrobo.lightSensor(connectorAnalogSensor.P0)))
```

* Turn on an LED

Use this to turn on the LED. You can specify P0, P1, or P2.

```blocks
// Turn on an LED on P0:
artecrobo.turnOnLED(connectorDigitalSensor.P0)
```

* Turn on an LED

Use this to turn off the LED. You can specify P0, P1, or P2.

```blocks
// Turn off an LED on P0:
artecrobo.turnOffLED(connectorDigitalSensor.P0)
```

* Check whether an LED is on

Use this to check whether an LED is on. You can specify P0, P1, or P2.

```blocks
// Run a command when an LED on P0 is on:
if (artecrobo.isLEDOn(connectorDigitalSensor.P0)) {
}
```

* Use the micro:bit and ArtecRobo Buzzer to play a sound at the set frequency:

Use this to play a set note on the micro:bit and an ArtecRobo Buzzer. You can specify P0, P1, or P2 as well as the note using the frequency.

```blocks
// Play a sound at 262 Hz using the micro:bit and a Buzzer on P0:
artecrobo.turnOnSpeakerAndBuzzer(connectorDigitalSensor.P0, 262)
```

* Stop playing the micro:bit and an ArtecRobo Buzzer

Use this to stop the micro:bit and ArtecRobo Buzzer. You can specify P0, P1, or P2.

```blocks
// Stop playing the micro:bit and a Buzzer on P0:
artecrobo.turnOffSpeakerAndBuzzer(connectorDigitalSensor.P0)
```

* Use an ArtecRobo Buzzer to play a sound at the set frequency

Use this to play a note on an ArtecRobo Buzzer. You can specify P0, P1, or P2.

```blocks
// Play a sound at 262 Hz using a Buzzer on P0:
artecrobo.turnOnBuzzer(connectorDigitalSensor.P0, 262)
```

* Stop playing an ArtecRobo Buzzer

Use this to stop an ArtecRobo Buzzer. You can specify P0, P1, or P2.

```blocks
// Stop playing a Buzzer on P0:
artecrobo.turnOffBuzzer(connectorDigitalSensor.P0)
```

* Check if an ArtecRobo Buzzer is playing

Use this to check whether an ArtecRobo Buzzer is playing. You can specify P0, P1, or P2.

```blocks
// Show a heart icon if a Buzzer on P0 is playing:
if (artecrobo.isBuzzerplaying(connectorDigitalSensor.P0)) {
    basic.showIcon(IconNames.Heart)
}
```

* Set the speed of a DC Motor

Use this to set the speed of a DC Motor. You can specify M0 or M1 and a speed from 0 to 1023. 

```blocks
// Set M0 Dcmotor to max power(1023)
artecrobo.setSpeedDCMotor(connectorDCMotor.M0, 1023)
```

* Set the direction of a DC Motor

Use this to move a DC Motor in a set direction. You can specify M0 or M1 and a direction of Forward, Backward, Brake or Coast.

```blocks
// Control M0 DC motor to Forward
artecrobo.moveDCMotor(connectorDCMotor.M0, DCmotion.Forward)
```

* Set a Servomotor angle

Use this to move a Servomotor to a set angle. You can specify C13, C14 or C15 and an angle from 0 to 180.

```blocks
// Set a Servomotor on C13 to 90 degrees
artecrobo.moveServoMotorMax(connectorServoMotor.C13, 90)
```

* Set a Servomotor angle at a set speed

Use this to move a Servomotor at a set speed. You can specify C13, C14 or C15, an angle from 0 to 180, and a speed from 1 to 20.

```blocks
// Set a Servomotor on C13 to 90 degrees at speed 20:
artecrobo.moveServoMotor(connectorServoMotor.C13, 90, 20)
```

* Set multiple Servomotor angles at a set speed 

Use this to move multiple Servomotors at a set speed. You can specify C13, C14 or C15, an angle from 0 to 180, and a speed from 1 to 20.


```blocks
// Set Servomotors on C13, C14, and C15 to 0, 90, and 180 degrees at speed 20:
artecrobo.AsyncMoveServoMotor(20, 0, 90, 180)
```


## License

MIT


## Supported targets

* for PXT/calliopemini
(The metadata above is needed for package search.)

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>