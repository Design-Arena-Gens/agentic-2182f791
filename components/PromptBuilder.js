'use client';

import { useMemo, useState } from 'react';
import { buildExportJson, buildRunwayGen3Prompt, buildWan22Prompt } from '../lib/promptFormatters';

const DEFAULT_INPUT = {
  video_style: 'Cinematic Narrative, Photorealistic CGI, Magical Realism',
  tool_compatibility: 'Wan 2.2 / Runway Gen-3 Alpha',
  prompt_text: [
    'A cinematic sequence.',
    '[Scene 1] A man walking in a park, camera follows from behind (no face visible). Suddenly he stops, grabbing his knee in sharp pain, bending over.',
    '[Scene 2] Three realistic bees fly in from different sides. Bee 1 carries a glowing golden drop (Royal Jelly). Bee 2 carries a dark resin chunk (Propolis). Bee 3 carries a fresh green herb leaf.',
    "[Scene 3] The bees converge on the man's knee and gently deposit the ingredients. A magical healing light absorbs into the fabric/skin.",
    '[Scene 4] The man stands up immediately, pain-free, and continues walking briskly.',
    "[Scene 5] The South Moon Propolis Tube appears in the foreground with a 'Solved' checkmark. 8k, detailed textures, emotional pacing."
  ].join('\n'),
  motion_parameters: {
    camera_movement: 'Follow Shot -> Multi-angle (Bees) -> Close-up (Knee) -> Wide (Walking)',
    motion_scale: 7,
    shutter: '180deg',
    duration_seconds: 10
  },
  resolution: '8k',
  aspectRatio: '16:9',
  fps: 24,
  negative: 'distortion, extra limbs, deformed face, low poly, text artifacts'
};

function Section({ title, children, action }) {
  return (
    <section className="card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="title">{title}</h2>
        {action}
      </div>
      <div className="divider" />
      {children}
    </section>
  );
}

export default function PromptBuilder() {
  const [form, setForm] = useState(DEFAULT_INPUT);
  const [activeTab, setActiveTab] = useState('wan');

  const wanPrompt = useMemo(() => buildWan22Prompt(form), [form]);
  const runwayPrompt = useMemo(() => buildRunwayGen3Prompt(form), [form]);
  const exportJson = useMemo(() => buildExportJson(form), [form]);

  function handleChange(path, value) {
    setForm((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let target = clone;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return clone;
    });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error('Clipboard error', e);
    }
  }

  function downloadJson(obj, filename = 'prompt.json') {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-2">
      <div className="grid">
        <Section
          title="Project"
          action={<span className="badge">Compatibility: {form.tool_compatibility}</span>}
        >
          <div className="grid">
            <div>
              <label className="label">Video Style</label>
              <input
                className="control"
                value={form.video_style}
                onChange={(e) => handleChange('video_style', e.target.value)}
                placeholder="e.g., Cinematic, Photorealistic, Magical Realism"
              />
            </div>

            <div className="grid grid-3">
              <div>
                <label className="label">Resolution</label>
                <input
                  className="control"
                  value={form.resolution}
                  onChange={(e) => handleChange('resolution', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Aspect Ratio</label>
                <input
                  className="control"
                  value={form.aspectRatio}
                  onChange={(e) => handleChange('aspectRatio', e.target.value)}
                />
              </div>
              <div>
                <label className="label">FPS</label>
                <input
                  type="number"
                  className="control"
                  value={form.fps}
                  onChange={(e) => handleChange('fps', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Narrative">
          <label className="label">Scenes (use [Scene 1], [Scene 2], ...)</label>
          <textarea
            className="control mono"
            rows={10}
            value={form.prompt_text}
            onChange={(e) => handleChange('prompt_text', e.target.value)}
          />
          <div style={{ height: 8 }} />
          <div className="grid grid-3">
            <div>
              <label className="label">Negative Prompt</label>
              <input
                className="control"
                value={form.negative}
                onChange={(e) => handleChange('negative', e.target.value)}
                placeholder="Unwanted traits/artifacts"
              />
            </div>
            <div>
              <label className="label">Tool Compatibility</label>
              <input
                className="control"
                value={form.tool_compatibility}
                onChange={(e) => handleChange('tool_compatibility', e.target.value)}
              />
            </div>
          </div>
        </Section>

        <Section title="Motion">
          <div className="grid">
            <div>
              <label className="label">Camera Movement</label>
              <input
                className="control"
                value={form.motion_parameters.camera_movement}
                onChange={(e) => handleChange('motion_parameters.camera_movement', e.target.value)}
              />
            </div>
            <div className="grid grid-3">
              <div>
                <label className="label">Motion Scale</label>
                <input
                  type="number"
                  className="control"
                  value={form.motion_parameters.motion_scale}
                  onChange={(e) => handleChange('motion_parameters.motion_scale', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Shutter</label>
                <input
                  className="control"
                  value={form.motion_parameters.shutter}
                  onChange={(e) => handleChange('motion_parameters.shutter', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Duration (s)</label>
                <input
                  type="number"
                  className="control"
                  value={form.motion_parameters.duration_seconds}
                  onChange={(e) => handleChange('motion_parameters.duration_seconds', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid">
        <Section
          title="Prompts"
          action={
            <div className="row">
              <button className="btn secondary" onClick={() => setActiveTab('wan')} style={{ opacity: activeTab === 'wan' ? 1 : 0.7 }}>
                Wan 2.2
              </button>
              <button className="btn secondary" onClick={() => setActiveTab('runway')} style={{ opacity: activeTab === 'runway' ? 1 : 0.7 }}>
                Runway Gen-3
              </button>
              <button className="btn" onClick={() => copyToClipboard(activeTab === 'wan' ? wanPrompt : runwayPrompt)}>
                Copy
              </button>
            </div>
          }
        >
          <pre className="mono" style={{ maxHeight: 520, overflow: 'auto', margin: 0 }}>
{activeTab === 'wan' ? wanPrompt : runwayPrompt}
          </pre>
        </Section>

        <Section
          title="Export"
          action={
            <div className="row">
              <button className="btn secondary" onClick={() => copyToClipboard(JSON.stringify(exportJson, null, 2))}>
                Copy JSON
              </button>
              <button className="btn" onClick={() => downloadJson(exportJson, 'prompt-wan-runway.json')}>
                Download JSON
              </button>
            </div>
          }
        >
          <div className="grid grid-3">
            <div className="card" style={{ background: '#0f1116' }}>
              <div className="label">Tool</div>
              <div>Wan 2.2</div>
            </div>
            <div className="card" style={{ background: '#0f1116' }}>
              <div className="label">Tool</div>
              <div>Runway Gen-3 Alpha</div>
            </div>
            <div className="card" style={{ background: '#0f1116' }}>
              <div className="label">Aspect</div>
              <div>{form.aspectRatio}</div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

