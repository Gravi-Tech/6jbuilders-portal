<template>
    <v-container>
        <h1 class="text-center mb-6">Meet Our Team</h1>
        <v-row class="d-flex justify-center">
            <v-col cols="8" md="3" v-for="(member, index) in teamMembers" :key="index">
                <div class="team-member">
                    <v-avatar size="120">
                        <v-img :src="member.image" cover class="circle" />
                    </v-avatar>
                    <h2 class="team-member-name">{{ member.name }}</h2>
                    <span class="team-member-position">{{ member.position }}</span>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { teamMembers } from '@/dataUtils/teamData';
export default {
    data() {
        return {
            teamMembers: teamMembers,
        };
    },
};
</script>
  
<style scoped>
.team-member {
    text-align: center;
    margin-bottom: 1rem;
}

.team-member-name {
    font-size: 18px;
    font-weight: bold;
    margin-top: 5px;
}

.team-member-position {
    font-size: 14px;
    color: #888;
}
</style>  