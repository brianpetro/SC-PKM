import AppKit
import CoreGraphics
import Foundation

let win_x = 1969.0
let win_y = 175.0

func pause(_ seconds: Double) {
  Thread.sleep(forTimeInterval: seconds)
}

func point(_ x: Double, _ y: Double) -> CGPoint {
  CGPoint(x: win_x + x, y: win_y + y)
}

func move(_ x: Double, _ y: Double) {
  let p = point(x, y)
  CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)?
    .post(tap: .cghidEventTap)
}

func mouse_down(_ p: CGPoint) {
  CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: p, mouseButton: .left)?
    .post(tap: .cghidEventTap)
}

func mouse_up(_ p: CGPoint) {
  CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: p, mouseButton: .left)?
    .post(tap: .cghidEventTap)
}

func click(_ x: Double, _ y: Double, hold: Double = 0.08) {
  let p = point(x, y)
  move(x, y)
  pause(0.22)
  mouse_down(p)
  pause(hold)
  mouse_up(p)
  pause(0.22)
}

func key(_ code: CGKeyCode, flags: CGEventFlags = []) {
  let down = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: true)
  down?.flags = flags
  down?.post(tap: .cghidEventTap)
  pause(0.04)
  let up = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: false)
  up?.flags = flags
  up?.post(tap: .cghidEventTap)
  pause(0.12)
}

func paste() {
  key(9, flags: .maskCommand)
}

let command = CommandLine.arguments.dropFirst().first ?? ""

switch command {
case "copy_ranked_links":
  pause(0.25)
  click(906, 72)
  click(1028, 132)
  pause(0.25)
  click(142, 292)
  paste()
  pause(1.2)

case "open_smart_graph":
  pause(0.55)
  click(906, 72)
  click(1034, 181)
  pause(3.0)

case "focus_graph_cluster":
  pause(0.55)
  click(213, 452)
  pause(0.35)
  click(608, 680)
  pause(1.7)

default:
  fputs("unknown command\n", stderr)
  exit(64)
}
