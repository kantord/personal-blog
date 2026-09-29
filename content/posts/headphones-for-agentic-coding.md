---
title: Picking headphones for agentic coding: why I ended up with open-back
date: 2026-09-29
slug: headphones-for-agentic-coding
---

A lot of my coding now happens by talking. I have music on, I hit a key on a macropad, the
music ducks, I dictate a prompt to a coding agent, and the music comes back while the agent
works. Transcription runs locally and the whole loop is driven by an i3 keybinding.

That sounds like a solved problem: buy decent headphones. It wasn't. I went down a proper
rabbit hole, and the useful part of the story is how many of my starting assumptions were
wrong. Here's the short version, in case your setup looks like mine.

## Where I started: sealed buds with noise cancelling

My first requirement list was the obvious one: in-ear buds that seal the canal, strong
active noise cancelling, good codecs. The usual "headphones for focus" advice. I spent real
time on it too: comparing ANC tiers, reading about hiss in quiet rooms, even working out how
to look after my ears if I was going to have plugs in them all day.

All of that turned out to be for the wrong product.

## The flip: you have to hear yourself talk

The thing I'd missed is the **occlusion effect**. When you seal your ear canal and speak,
your own voice comes back boomy, as if you're talking inside a barrel. The natural reaction
is to speak more quietly, and quiet mumbling is exactly what a speech-to-text model doesn't
want.

For a workflow that's "listen, then talk, then listen again", sealing the ear is actively
wrong, and noise cancelling is working against you. You *want* to hear your own voice and
the room. That flipped the whole search from sealed buds to anything open: open-ear buds,
or open-back headphones.

It also made a lot of spec-sheet features irrelevant. I use a separate desk mic for
dictation and calls, so multi-mic AI call processing is dead weight. Spatial audio at a desk
is pointless. ANC is now a negative. Once those are gone, you're paying for comfort and
drivers that don't sound bad, which you can get well below flagship prices.

## The requirements that actually mattered

When I finally wrote the needs down instead of a product category, they were:

- **Hear myself speak.** No seal, so no occlusion.
- **Keep awareness of the room.**
- **Wireless, with range through walls.** I get up and walk around a small flat while
  listening.
- **Comfortable for about six hours a day.**
- **Works on Linux**, behind a KVM switch that flips my desk between two machines.
- **Sound that isn't bad.**

## The latency trap

For a while I also wanted sub-20 ms audio, so that turning a knob on the macropad would give
an instant click in my ears. I spent far too long on this. The honest conclusion was that no
private, wireless path delivers it. Bluetooth is nowhere close. The better 2.4 GHz gaming
dongles are measured somewhere in the 24–38 ms range, whatever the box says. The only way
under 20 ms was a wired speaker, which isn't private.

So I dropped the requirement. Discrete sounds such as "dictation started" or "workspace
switched" don't need that kind of latency, because nothing physical is competing with them.
Per-detent knob ticks were the only thing that did, and I can live without them. If you're
chasing latency for a similar reason, check first that the feature it serves is worth it.

## The mistake: searching for a form factor

By now the search was framed as "open-ear buds", and that framing quietly threw out the
thing I ended up buying: the **Turtle Beach Atlas Air**, a wireless open-back gaming
headset. It was dismissed because it's a headset, not because it failed any of the needs
above. Scored against the actual list, it does well:

- Open-back, so no occlusion. Hearing your own voice works for the same reason it does with
  open-ear buds.
- Real 40 mm drivers in a proper chamber, instead of tiny drivers hovering next to your ear
  and struggling with bass.
- A 2.4 GHz USB dongle that plugs straight into the KVM. No Bluetooth stack, no pairing
  dance when switching machines.
- A long battery life (around 50 hours claimed).

It's also close to the only wireless open-back headset on the market. I paid €157 for it.

## Living with it on Linux

The verdict after about two months: **it works great in USB dongle mode.** The dongle shows up
as a plain USB audio device, PipeWire treats it as an ordinary sound card, and it just works.
No driver, no config.

Some honest caveats if you're considering one:

- **Only the audio works on Linux.** The companion app (EQ, battery level, sidetone) is
  Windows-only, and the usual Linux tool for headset extras doesn't support Turtle Beach.
  I do EQ in PipeWire instead.
- **It leaks sound both ways.** That's the point for me, but with a sensitive desk mic,
  music can bleed into your dictation. My fix is in the script: duck the music first, wait
  about 150 ms, then open the mic.
- **The kernel log is noisier than the experience.** Every KVM switch cold-boots the dongle,
  and it logs some ugly re-enumeration errors. In daily use I haven't noticed it.
- I don't use its boom mic at all. Dictation goes through a separate dynamic mic and an
  audio interface, which I'd recommend if you talk to your computer a lot.

## What I'd tell you

If you code by voice with music on:

1. **Don't seal your ears.** Occlusion makes talking unpleasant and dictation worse. Open-ear
   or open-back.
2. **Skip ANC and fancy call mics** if you have a proper desk mic. They're paying for a
   different job.
3. **Write down needs, not a product category.** My best option sat outside the category I
   was searching in.
4. **On Linux, a USB dongle beats Bluetooth**: no profile switching, and it survives a KVM.
5. **Stop researching and try it.** I produced far more research than this decision needed.
   Several of the problems I spent the most time on either didn't show up in practice or
   disappeared once I simply measured.
