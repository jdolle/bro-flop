/**
 * Entry point for the game
 */

import { Game } from './scripts/game'

/**
 * Main application
 */
class App {
  constructor() {
    this.onDeviceReady = this.onDeviceReady.bind(this)
  }

  // Application Constructor
  public init() {
    this.bindEvents()
  }

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  private bindEvents() {
    document.addEventListener('deviceReady', this.onDeviceReady, false)
  }

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  private onDeviceReady() {
    new Game().init()
  }
}

new App().init()
