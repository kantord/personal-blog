---
title: Picking headphones for agentic coding: why I ended up with open-back
date: 2026-09-29
slug: headphones-for-agentic-coding
---

Once I started working with AI agents a lot, I finally started using voice typing
properly. Explaining a task to an agent is much faster by talking than by typing, so now a
big part of my day goes like this: hit a key, the music pauses, dictate a prompt, and the
music comes back while the agent works. Transcription runs locally and the whole loop hangs
off an i3 keybinding.

The catch is that I didn't want to give up listening to music. That turned "buy decent
headphones" into a surprisingly specific problem with two requirements I hadn't thought
about before:

- **Low latency**, so pausing and resuming the music around dictation feels instant instead
  of laggy.
- **Open ears**, because talking a lot with your ears blocked is extremely uncomfortable.

I went down a proper rabbit hole to get there, and plenty of my starting assumptions were
wrong. Here's the short version, in case your setup looks like mine.

## Why open ears matter when you talk all day

My first instinct was the usual "headphones for focus" advice: in-ear buds that seal the
canal, strong active noise cancelling, good codecs. I spent real time on it too, comparing
noise-cancelling tiers and reading about hiss in quiet rooms.

All of that was for the wrong product. When your ears are sealed and you speak, your own
voice comes back boomy, as if you're talking inside a barrel. This is the **occlusion
effect**. Once in a while it's fine. When you're talking every few minutes all day, it's
genuinely unpleasant. You also end up speaking more quietly, and mumbling is exactly what a
speech-to-text model doesn't want.

So sealing is actively wrong for this workflow, and noise cancelling works against you. You
*want* to hear your own voice and the room. That flipped the search to anything open:
open-ear buds, or open-back headphones.

It also made a lot of spec-sheet features irrelevant. I use a separate desk mic for
dictation and calls, so multi-mic AI call processing is dead weight. Spatial audio at a desk
is pointless. Once those are gone, you're paying for comfort and drivers that don't sound
bad, which you can get well below flagship prices.

## Why latency matters: pausing music without the lag

The dictation key pauses the music before the mic opens, and releasing it brings the music
back. With a laggy link you hear the music keep going for a moment after you've started
talking, and the whole thing feels clumsy instead of like a single action.

Bluetooth is the weak point here. Latency is often around 200 ms, and on Linux opening a mic
can make Bluetooth headphones switch to the low-quality "headset" profile mid-song unless
you disable that. A 2.4 GHz USB dongle, the kind gaming headsets use, is much better: tens of
milliseconds, and no Bluetooth stack involved at all.

I did take this one step too far at first. I wanted under 20 ms, so that turning a knob on
my macropad would give an instant click in my ears. No private, wireless option delivers
that. Even the good gaming dongles measure somewhere around 24–38 ms, whatever the box says,
and the only way under 20 ms was a wired speaker, which isn't private. So I dropped the
knob clicks. For pausing music and short "dictation started" sounds, dongle latency is
plenty.

## The requirements that actually mattered

When I finally wrote the needs down instead of a product category, they were:

- **Hear myself speak.** No seal, so no occlusion.
- **Low enough latency** that pausing around dictation feels seamless.
- **Keep awareness of the room.**
- **Wireless, with range through walls.** I get up and walk around a small flat while
  listening.
- **Comfortable for about six hours a day.**
- **Works on Linux**, behind a KVM switch that flips my desk between two machines.
- **Sound that isn't bad.**

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
4. **Use a 2.4 GHz USB dongle, not Bluetooth.** Lower latency makes auto-pausing music feel
   seamless, there is no profile switching, and on Linux it survives a KVM.
5. **Stop researching and try it.** I produced far more research than this decision needed.
   Several of the problems I spent the most time on either didn't show up in practice or
   disappeared once I simply measured.
