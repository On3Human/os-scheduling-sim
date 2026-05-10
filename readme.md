# CPU Scheduling Simulator: Round Robin vs Priority

## Project Description
This project is a web-based CPU scheduling simulator that implements and compares two scheduling algorithms: Round Robin and Priority Scheduling. The main objective is to compare a scheduler that shares CPU time across ready processes (Round Robin) with a scheduler that favors more important processes according to priority. The simulator analyzes how urgency, fairness, starvation risk, and policy-driven service affect execution order and performance metrics.

## Requirements
- Accept a dynamic number of processes and all required process data at runtime.
- Validate all input, including time quantum and priority values.
- Simulate the Round Robin algorithm correctly, handling proper ready-queue rotation and process arrival.
- Simulate the Priority Scheduling algorithm correctly, enforcing clearly defined priority and tie-breaking rules.
- Display separate Gantt charts for both algorithms.
- Display separate results tables for both algorithms.
- Calculate and display individual and average metrics: Waiting Time (WT), Turnaround Time (TAT), and Response Time (RT).
- Provide a comparison analysis focusing on fairness vs. urgency, starvation risk, and overall service balance.

## Build and Run Steps
This is a client-side web application using HTML, CSS, and JavaScript. There are no external dependencies or build processes required.

1. Clone or download the repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. Use the interface to input a Time Quantum, add processes with Arrival Time, Burst Time, and Priority.
4. Click the "Run" button to execute the simulations and view the charts and analysis.

## Team Members (Team 66)
- Mazen Mohamed Abdulmaujood Abdulmaujeed (20240770)
- Mohamed Bakr Othman El-Shafei (20240805)
- Ahmed Abdelazeem Mohamed El-Azhari (20240054)
- Mazen Mostafa Saad Ahmed (20240771)
- Kirollos Kamal Labib Naseem (20240731)
- Yamen Samer Mahmoud Ahmed Radwan (20241115)

## Test Scenarios

### Scenario A: Basic Mixed Workload
**Description:** Normal mixed workload that observes general behavior of both algorithms.
- **Time Quantum:** 3
- **Processes:**
  - **P1:** Arrival Time = 0, Burst Time = 6, Priority = 3
  - **P2:** Arrival Time = 1, Burst Time = 4, Priority = 1
  - **P3:** Arrival Time = 2, Burst Time = 8, Priority = 4
  - **P4:** Arrival Time = 3, Burst Time = 2, Priority = 2
  - **P5:** Arrival Time = 4, Burst Time = 5, Priority = 3

**Gantt Chart Output:**
![A Gant chart for basic mixed workload](/screenshots/basic_gant.png)

---

### Scenario B: Urgency Case
**Description:** Two high-priority processes to observe how Priority scheduling favors them vs RR.
- **Time Quantum:** 4
- **Processes:**
  - **P1:** Arrival Time = 0, Burst Time = 10, Priority = 4
  - **P2:** Arrival Time = 1, Burst Time = 3, Priority = 1
  - **P3:** Arrival Time = 2, Burst Time = 5, Priority = 4
  - **P4:** Arrival Time = 3, Burst Time = 2, Priority = 1
  - **P5:** Arrival Time = 5, Burst Time = 7, Priority = 3

**Gantt Chart Output:**
![A Gant chart for urgency case](/screenshots/urgency_gant.png)
---

### Scenario C: Fairness Case
**Description:** Equal processes: RR distributes service evenly; Priority is FCFS here.
- **Time Quantum:** 2
- **Processes:**
  - **P1:** Arrival Time = 0, Burst Time = 8, Priority = 3
  - **P2:** Arrival Time = 0, Burst Time = 8, Priority = 3
  - **P3:** Arrival Time = 0, Burst Time = 8, Priority = 3
  - **P4:** Arrival Time = 0, Burst Time = 8, Priority = 3

**Gantt Chart Output:**
![A Gant chart for fair workload](/screenshots/fair_gant.png)

