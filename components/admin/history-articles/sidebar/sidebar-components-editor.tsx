"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface SidebarComponentsEditorProps {
  components: any[]
  onChange: (components: any[]) => void
}

export default function SidebarComponentsEditor({
  components,
  onChange
}: SidebarComponentsEditorProps) {
  const [activeComponents, setActiveComponents] = useState(components || [])

  const addComponent = (type: string) => {
    const newComponent = {
      id: Date.now().toString(),
      __component: type,
      data: getDefaultData(type)
    }
    const updated = [...activeComponents, newComponent]
    setActiveComponents(updated)
    onChange(updated)
  }

  const updateComponent = (id: string, data: any) => {
    const updated = activeComponents.map(comp =>
      comp.id === id ? { ...comp, data } : comp
    )
    setActiveComponents(updated)
    onChange(updated)
  }

  const removeComponent = (id: string) => {
    const updated = activeComponents.filter(comp => comp.id !== id)
    setActiveComponents(updated)
    onChange(updated)
  }

  const getDefaultData = (type: string) => {
    switch (type) {
      case 'sidebar.key-facts':
        return { facts: [{ number: 1, title: '', description: '' }] }
      case 'sidebar.timeline':
        return { events: [{ year: '', event: '' }] }
      default:
        return {}
    }
  }

  return (
    <div className="space-y-4">
      {/* Tutorial Section */}
      <Card className="p-4 bg-blue-900/20 border-blue-700">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">📚 SIDEBAR KOMPONENTY - TUTORIÁL</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p className="font-medium text-white">Môžeš pridať 2 typy komponentov:</p>

          <div className="ml-4 space-y-3">
            <div>
              <p className="text-yellow-400 font-medium">📊 Key Facts (Kľúčové fakty)</p>
              <ul className="ml-4 text-xs space-y-1 mt-1">
                <li>• Číslo - poradie faktu (napr. 1, 2, 3)</li>
                <li>• Názov - krátky názov faktu (napr. "Založenie")</li>
                <li>• Popis - detail faktu (napr. "41 po Kr. za cisára Claudia")</li>
              </ul>
              <p className="text-gray-400 text-xs mt-1">Príklad: 1 | Založenie | 41 po Kr. za cisára Claudia</p>
            </div>

            <div>
              <p className="text-green-400 font-medium">📅 Timeline (Časová os)</p>
              <ul className="ml-4 text-xs space-y-1 mt-1">
                <li>• Rok - dátum udalosti (napr. "41 po Kr.")</li>
                <li>• Udalosť - popis čo sa stalo</li>
              </ul>
              <p className="text-gray-400 text-xs mt-1">Príklad: 41 po Kr. | Založenie XV. légie Apollinaris</p>
            </div>
          </div>

          <p className="text-orange-300 text-xs mt-3">💡 TIP: Môžeš pridať viac faktov/udalostí kliknutím na "Add Fact" alebo "Add Event"</p>
          <p className="text-gray-500 text-xs">ℹ️ Komponenty sa zobrazia v pravom sidebari článku</p>
        </div>
      </Card>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-4">Pridaj komponenty:</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addComponent('sidebar.key-facts')}
            className="bg-yellow-900/20 hover:bg-yellow-900/30 border-yellow-700"
          >
            <Plus className="mr-2 h-3 w-3" />
            📊 Key Facts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addComponent('sidebar.timeline')}
            className="bg-green-900/20 hover:bg-green-900/30 border-green-700"
          >
            <Plus className="mr-2 h-3 w-3" />
            📅 Timeline
          </Button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={activeComponents.map(c => c.id)}>
        {activeComponents.map((component) => (
          <AccordionItem key={component.id} value={component.id}>
            <div className="flex items-center justify-between">
              <AccordionTrigger className="text-white flex-1">
                <span>{component.__component.replace('sidebar.', '').replace('-', ' ')}</span>
              </AccordionTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 mr-2"
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <AccordionContent>
              {component.__component === 'sidebar.key-facts' && (
                <KeyFactsEditor
                  data={component.data}
                  onChange={(data) => updateComponent(component.id, data)}
                />
              )}
              {component.__component === 'sidebar.timeline' && (
                <TimelineEditor
                  data={component.data}
                  onChange={(data) => updateComponent(component.id, data)}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {activeComponents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No sidebar components added yet.</p>
          <p className="text-sm mt-2">Add components using the buttons above.</p>
        </div>
      )}
    </div>
  )
}

// Key Facts Editor
function KeyFactsEditor({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const facts = data?.facts || []

  const addFact = () => {
    const updated = {
      ...data,
      facts: [...facts, { number: facts.length + 1, title: '', description: '' }]
    }
    onChange(updated)
  }

  const updateFact = (index: number, fact: any) => {
    const updated = {
      ...data,
      facts: facts.map((f: any, i: number) => i === index ? fact : f)
    }
    onChange(updated)
  }

  const removeFact = (index: number) => {
    const updated = {
      ...data,
      facts: facts.filter((_: any, i: number) => i !== index)
    }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-yellow-400 mb-2">
        Príklady faktov: Založenie | Počet vojakov | Domovská základňa | Symbol
      </div>
      {facts.map((fact: any, index: number) => (
        <Card key={index} className="p-3 bg-gray-700/50 border-yellow-700/30">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                value={fact.number}
                onChange={(e) => updateFact(index, { ...fact, number: parseInt(e.target.value) })}
                className="w-20 bg-gray-700 border-gray-600 text-white"
                placeholder="#"
              />
              <Input
                value={fact.title}
                onChange={(e) => updateFact(index, { ...fact, title: e.target.value })}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
                placeholder="Názov faktu (napr. Založenie)"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFact(index)}
                className="h-8 w-8"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={fact.description}
              onChange={(e) => updateFact(index, { ...fact, description: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Popis (napr. 41 po Kr. za cisára Claudia)"
              rows={2}
            />
          </div>
        </Card>
      ))}
      <Button onClick={addFact} variant="outline" size="sm" className="w-full">
        <Plus className="mr-2 h-3 w-3" />
        Add Fact
      </Button>
    </div>
  )
}

// Timeline Editor
function TimelineEditor({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const events = data?.events || []

  const addEvent = () => {
    const updated = {
      ...data,
      events: [...events, { year: '', event: '' }]
    }
    onChange(updated)
  }

  const updateEvent = (index: number, event: any) => {
    const updated = {
      ...data,
      events: events.map((e: any, i: number) => i === index ? event : e)
    }
    onChange(updated)
  }

  const removeEvent = (index: number) => {
    const updated = {
      ...data,
      events: events.filter((_: any, i: number) => i !== index)
    }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-green-400 mb-2">
        Príklady: 41 po Kr. | 63 po Kr. | 71-73 po Kr. | 117-138 po Kr.
      </div>
      {events.map((event: any, index: number) => (
        <div key={index} className="flex gap-2 p-2 bg-gray-700/30 rounded border border-green-700/30">
          <Input
            value={event.year}
            onChange={(e) => updateEvent(index, { ...event, year: e.target.value })}
            className="w-32 bg-gray-700 border-gray-600 text-white"
            placeholder="Rok (41 po Kr.)"
          />
          <Input
            value={event.event}
            onChange={(e) => updateEvent(index, { ...event, event: e.target.value })}
            className="flex-1 bg-gray-700 border-gray-600 text-white"
            placeholder="Udalosť (napr. Založenie XV. légie)"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => removeEvent(index)}
            className="h-8 w-8"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button onClick={addEvent} variant="outline" size="sm" className="w-full">
        <Plus className="mr-2 h-3 w-3" />
        Add Event
      </Button>
    </div>
  )
}