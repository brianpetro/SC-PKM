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

func click(_ x: Double, _ y: Double, hold: Double = 0.15) {
  let p = point(x, y)
  move(x, y)
  pause(0.75)
  mouse_down(p)
  pause(hold)
  mouse_up(p)
}

func key(_ code: CGKeyCode, flags: CGEventFlags = []) {
  let down = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: true)
  down?.flags = flags
  down?.post(tap: .cghidEventTap)
  pause(0.08)
  let up = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: false)
  up?.flags = flags
  up?.post(tap: .cghidEventTap)
}

func pasteboard(_ text: String) {
  NSPasteboard.general.clearContents()
  NSPasteboard.general.setString(text, forType: .string)
}

func paste() {
  key(9, flags: .maskCommand)
}

func drag(_ from_x: Double, _ from_y: Double, _ to_x: Double, _ to_y: Double) {
  let from = point(from_x, from_y)
  let to = point(to_x, to_y)
  move(from_x, from_y)
  pause(0.8)
  mouse_down(from)
  pause(0.25)
  for step in 1...24 {
    let t = Double(step) / 24.0
    let p = CGPoint(
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t
    )
    CGEvent(mouseEventSource: nil, mouseType: .leftMouseDragged, mouseCursorPosition: p, mouseButton: .left)?
      .post(tap: .cghidEventTap)
    pause(0.025)
  }
  pause(0.35)
  mouse_up(to)
}

let command = CommandLine.arguments.dropFirst().first ?? ""

switch command {
case "copy_list_to_note":
  pause(1.0)
  pasteboard("\nRanked links:\n")
  click(150, 256)
  key(124, flags: .maskCommand)
  paste()
  pause(1.0)
  click(944, 76)
  pause(0.4)
  click(1028, 132)
  pause(1.0)
  click(260, 280)
  key(124, flags: .maskCommand)
  key(36)
  paste()
  pause(2.0)

case "explore_smart_graph":
  pause(1.0)
  click(944, 76)
  pause(0.4)
  click(1030, 181)
  pause(3.5)

case "graph_focus_actions":
  pause(1.0)
  move(211, 453)
  pause(1.4)
  click(211, 453)
  pause(1.0)
  click(236, 680)
  pause(1.0)
  click(606, 680)
  pause(1.2)
  click(725, 680)
  pause(1.2)
  click(454, 724)
  pause(1.5)

case "expand_result_and_copy":
  pause(1.0)
  click(849, 451)
  pause(1.2)
  click(944, 76)
  pause(0.4)
  click(1028, 132)
  pause(1.0)

case "mini_graph_drag_retest":
  pause(1.0)
  click(199, 256)
  pause(0.4)
  drag(1055, 311, 199, 256)
  pause(2.0)

default:
  fputs("unknown command\n", stderr)
  exit(64)
}
