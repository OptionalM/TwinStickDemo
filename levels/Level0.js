// Level in format inspired by bulletML

const level0 = `
<document>

<action type='slow'>
  <wait type='time'>60</wait>
  <!-- Part 1 -->
  <!-- 3 enemies. Each spawns 5 more 2 seconds after death. -->
    <action type='slow'>
      <repeat type='fast'>
        <times>3 + _($rand * 5)</times>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <wait type='time'>120</wait>
          <repeat type='fast'>
            <times>5</times>
            <action type='slow'>
              <spawn>
                <enemy/>
              </spawn>
            </action>
          </repeat>
        </action>
      </repeat>
    </action>
  <wait type='time'>60</wait>
  <!-- Part 2 -->
  <!-- Spawn 6 enemies/second; they die after 8s~25s with ~16s being the most probable -->
  <action type='slow'>
    <ttl>(500) + _($clt * 1000)</ttl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <spawn>
          <enemy/>
        </spawn>
        <wait type='time'>10</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>480</wait>
</action>
</document>`;
