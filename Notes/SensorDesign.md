```mermaid

classDiagram

sensorGroup <|-- Sensor

Sensor <|-- sensorGroupTitle
Sensor <|-- graphSuperGroup

graphSuperGroup <|-- graphGroup

graphGroup <|-- parameterContainer
graphGroup <|-- canvas

parameterContainer <|-- parameter


```
