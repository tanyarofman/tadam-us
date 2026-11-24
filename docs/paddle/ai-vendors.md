# AI services: what they do with customer data

The services Ilan uses (Tanya, 2026-11-24): **Base44, ElevenLabs, HeyGen, Seedance, Codex**. Checked against each vendor's public terms on 2026-11-24. Contracts and plan settings can change this, so Ilan confirms each line in his accounts.

| Service | What it's used for (to confirm) | Trains on our data? | Keeps data? | Where | Source |
|---|---|---|---|---|---|
| **Base44** | App hosting, database, the AI that drafts questions | **Yes, on every plan except Enterprise** | Not stated | US | [Base44 privacy and security](https://docs.base44.com/Community-and-support/Privacy-and-security), [DPA](https://base44.com/about-us/legal/dpa) |
| **HeyGen** | The host's video | **Yes for non-Enterprise customers, unless you opt out through support.** Enterprise is excluded | Zero retention only with an addendum | US (AWS); EU transfers under the Data Privacy Framework | [HeyGen compliance](https://developers.heygen.com/docs/compliance), [DPA](https://www.heygen.com/data-processing-addendum) |
| **ElevenLabs** | The host's voice | Not stated clearly for its own models | **Yes, by default.** Zero retention is Enterprise only | Not stated | [Zero retention mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode) |
| **Seedance** (ByteDance, through BytePlus ModelArk) | Video generation | No, unless we authorize it | Not published | Malaysia, Indonesia and/or EU | [BytePlus data processing](https://docs.byteplus.com/en/docs/ModelArk/BytePlus_ModelArk_Data_Processing) |
| **Codex** (OpenAI) | Probably only for building the app | n/a if no customer data reaches it | n/a | n/a | Ilan to confirm |

## Why it matters

- The live **heytadam.com** (Hebrew and English FAQ and privacy page) already promises that content is "never used to train AI models". With Base44 and HeyGen on standard plans, that isn't true yet.
- The new privacy policy for tadamevents.com must list these services and must not promise more than they deliver. Paddle and EU regulators both read it.
- The content includes photos and stories of children.

## Ilan's to-do list

1. **Map what each service receives.** For each one: only the script text and names, or also photos and voice recordings? Is Seedance used on customer photos, or only for the pre-made hosts? If a service only sees our own pre-made material, it isn't a processor of customer data and drops off the privacy list.
2. **HeyGen:** ask support to opt the account out of training (in writing). Ask about the zero data retention addendum.
3. **Base44:** check whether the workspace has a training opt-out; otherwise check what the Enterprise plan costs. Ask which AI models (OpenAI, Anthropic, Google) process the questions.
4. **ElevenLabs:** ask whether API audio and text are used for training, and how long they're kept. Send API requests with `enable_logging=false` if the plan allows it.
5. **Seedance:** confirm it's used through BytePlus (international), not Volcano Engine (China).
6. **Codex:** confirm it never sees customer data.
7. **DPAs:** accept or sign each vendor's data processing agreement and keep a copy.
8. **Deletion:** make sure deleting a game after 30 days also deletes the files stored at each vendor.

When this is done, update the processors table in `privacy-policy.md` and remove the TODO there.
